import _ from 'lodash'
import Raven from 'raven-js'
import { Interaction, ViewerClientSpecMap, PlatformLogger, PlatformEnvData, BreadCrumbOption } from '@wix/thunderbolt-symbols'
import { createFedopsLogger } from '@wix/thunderbolt-commons'
import { platformBiLoggerFactory } from './bi/biLoggerFactory'
import { WixCodeAppDefId, WixCodeSentryDsn } from './constants'

function getSentryDsn(clientSpecMap: ViewerClientSpecMap, appDefinitionId: string, widgetId?: string): string | null {
	if (appDefinitionId === WixCodeAppDefId) {
		return WixCodeSentryDsn
	}

	const appDsn = _.get(clientSpecMap, [appDefinitionId, 'appFields', 'platform', 'viewer', 'errorReportingUrl'])
	if (widgetId) {
		// Use app dsn as default when looking for component dsn.
		return _.get(clientSpecMap, [appDefinitionId, 'widgets', widgetId, 'componentFields', 'viewer', 'errorReportingUrl'], appDsn)
	}

	return appDsn
}

export const platformLoggerCreator = ({ biData, clientSpecMap, url, isSSR }: { biData: PlatformEnvData['bi']; clientSpecMap: ViewerClientSpecMap; url: string; isSSR: boolean }): PlatformLogger => {
	const biLoggerFactory = platformBiLoggerFactory.createBiLoggerFactoryForFedops(biData)
	const fedopsLogger = createFedopsLogger({ biLoggerFactory, phasesConfig: 'SEND_START_AND_FINISH' })
	// Using "new Client()" to avoid altering the global raven. See raven-js/src/singleton.js
	// @ts-ignore
	const platformRaven = new Raven.Client()

	platformRaven.config('https://e0ad700df5e446b5bfe61965b613e52d@sentry.wixpress.com/715', { tags: { platform: true, url, isSSR, isCached: biData.isCached } })

	const captureBreadcrumb = (options: BreadCrumbOption) => platformRaven.captureBreadcrumb(options)

	const reportAsyncWithCustomKey = async <T>(methodName: string, key: string, asyncMethod: () => Promise<T>): Promise<T> => {
		try {
			// @ts-ignore @shahaf fedops logger does not have a 'customParam' prop, it's 'customParams' and expects an object
			fedopsLogger.interactionStarted(`platform_${methodName}`, { customParam: key })
			const fnResult = await asyncMethod()
			// @ts-ignore @shahaf fedops logger does not have a 'customParam' prop, it's 'customParams' and expects an object
			fedopsLogger.interactionEnded(`platform_${methodName}`, { customParam: key })
			return fnResult
		} catch (e) {
			platformRaven.captureException(e, { tags: { methodName } })
			throw e
		}
	}
	const runAndReport = <T>(methodName: string, method: () => T): T => {
		fedopsLogger.interactionStarted(methodName)
		try {
			const t = method()
			fedopsLogger.interactionEnded(methodName)
			return t
		} catch (e) {
			captureError(e, { tags: { methodName } })
			throw e
		}
	}

	const runAsyncAndReport = async <T>(methodName: string, asyncMethod: () => Promise<T> | T): Promise<T> => {
		try {
			fedopsLogger.interactionStarted(`platform_${methodName}`)
			const fnResult = await asyncMethod()
			fedopsLogger.interactionEnded(`platform_${methodName}`)
			return fnResult
		} catch (e) {
			platformRaven.captureException(e, { tags: { methodName } })
			throw e
		}
	}
	const captureError = (error: Error, options: any) => {
		console.error(error)
		const defaultOptions = {
			extra: {
				biData
			}
		}
		platformRaven.captureException(error, _.defaultsDeep(options, defaultOptions))
	}
	const interactionStarted = (interaction: Interaction) => fedopsLogger.interactionStarted(`platform_${interaction}`)
	const interactionEnded = (interaction: Interaction) => fedopsLogger.interactionEnded(`platform_${interaction}`)
	const reportAppPhasesNetworkAnalysis = (appId: string) => fedopsLogger.reportAppPhasesNetworkAnalysis({ appId })

	return {
		interactionStarted,
		interactionEnded,
		captureError,
		reportAsyncWithCustomKey,
		runAsyncAndReport,
		runAndReport,
		captureBreadcrumb,
		withReportingAndErrorHandling: async (phase, fnWithPromiseReturn, params) => {
			try {
				const appIdentifier = { appId: params.appDefinitionId, widgetId: params.controllerType }
				fedopsLogger.appLoadingPhaseStart(phase, appIdentifier)
				const res = await fnWithPromiseReturn()
				fedopsLogger.appLoadingPhaseFinish(phase, appIdentifier)
				return res
			} catch (e) {
				console.error(e)

				const dsn = getSentryDsn(clientSpecMap, params.appDefinitionId, params.controllerType)
				if (dsn) {
					// Using "new Client()" to avoid altering the global raven. See raven-js/src/singleton.js
					// @ts-ignore
					const reporter = new Raven.Client()
					reporter.config(dsn)
					reporter.captureException(e)
				}

				return Promise.resolve(null)
			}
		},
		reportAppPhasesNetworkAnalysis
	}
}

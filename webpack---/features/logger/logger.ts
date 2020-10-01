import { ContainerModuleLoader, withDependencies } from '@wix/thunderbolt-ioc'
import {
	LoggerSymbol,
	ILogger,
	Interaction,
	Phase,
	LoggerIntegrations,
	ViewerModel,
	WixBiSession,
	BiStore,
	IRendererPropsExtender,
	RendererPropsExtenderSym,
} from '@wix/thunderbolt-symbols'
import { Environment } from '../../types/Environment'
import { IStartInteractionOptions, IEndInteractionOptions } from '@wix/fedops-logger'
import { commonBiLoggerFactory, createFedopsLogger } from '@wix/thunderbolt-commons'

const getBiStore = (wixBiSession: WixBiSession, viewerModel: ViewerModel): BiStore => {
	const { rollout: rolloutData } = viewerModel

	const {
		msId: msid,
		viewerSessionId,
		requestId,
		initialTimestamp,
		initialRequestTimestamp,
		dc,
		is_rollout,
		isCached,
	} = wixBiSession

	return {
		msid,
		viewerSessionId,
		requestId,
		initialTimestamp,
		initialRequestTimestamp,
		dc,
		is_rollout,
		isCached,
		rolloutData,
		// TODO fix both this and /packages/feature-business-logger/src/businessLogger.ts
		pageData: {
			pageNumber: 0,
			pageId: 'TODO',
			pageUrl: 'TODO',
			isLightbox: false,
		},
		viewerVersion: process.env.browser ? window.thunderboltVersion : process.env.APP_VERSION!,
		is_headless: false,
	}
}

const createConsoleLogger = () => ({
	runAsyncAndReport: <T>(asyncMethod: () => Promise<T> | T, methodName: string) => {
		console.log(`${methodName}`)
		return Promise.resolve(asyncMethod())
	},
	reportAsyncWithCustomKey: <T>(asyncMethod: () => Promise<T>, methodName: string, key: string) => {
		console.log(`${methodName} ${key}`)
		return Promise.resolve(asyncMethod())
	},
	runAndReport: <T>(fn: () => T, methodName: string) => {
		console.log(`${methodName}`)
		return fn()
	},
	phaseMark: console.log,
	appLoaded: () => console.log('appLoaded'),
	reportAppLoadStarted: console.log,
	captureError: (...args: any) => {
		console.error(...args)
	},
	setGlobalsForErrors: (/* {tags, extras} = {}*/) => {},
	breadcrumb: (/* messageContent, additionalData = {}*/) => {},
	interactionStarted: console.log,
	interactionEnded: console.log,
})

const addTagsFromObject = (scope: any, obj: any) => {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			scope.setTag(key, obj[key])
		}
	}
}

const extractFingerprints = (exception: any) => {
	if (exception && exception.length) {
		const fingerprints = []
		fingerprints.push(exception[0].value)
		fingerprints.push(exception[0].type)
		if (exception[0].stacktrace && exception[0].stacktrace.length) {
			fingerprints.push(exception[0].stacktrace[0].function)
		}
		return fingerprints
	}
	return ['noData']
}

const getEnvironment = (fleetCode: number) => {
	if (fleetCode === 0) {
		return 'Production'
	} else if (fleetCode === 1) {
		return 'Rollout'
	}
	return 'Canary'
}

const extractFileNameFromErrorStack = (errorStack: string) => {
	const stackArray = errorStack.match(/([\w-.]+(?:\.js|\.ts))/)
	if (!stackArray || !stackArray.length) {
		return 'anonymous function'
	}
	return stackArray[0]
}

const shouldFilter = (message: string) => !message

export function createLogger(loggerIntegrations: LoggerIntegrations): ILogger {
	let sessionErrorLimit = 50
	const { sentry, wixBiSession, viewerModel, fetch } = loggerIntegrations
	const mode = viewerModel && viewerModel.mode ? viewerModel.mode : { qa: true }
	if (mode.qa || !sentry) {
		return createConsoleLogger()
	}

	const biStore = getBiStore(wixBiSession, viewerModel)
	const biLoggerFactory = commonBiLoggerFactory.createBiLoggerFactoryForFedops({ biStore, fetch })
	const fedopsLogger = createFedopsLogger({
		biLoggerFactory,
		phasesConfig: 'SEND_ON_START',
		appName: viewerModel.site && viewerModel.site.isResponsive ? 'thunderbolt-responsive' : 'thunderbolt',
		reportBlackbox: true,
	})

	const getInstance = (forceLoad: boolean = false) => {
		if (!process.env.browser) {
			return sentry
		}
		if (forceLoad) {
			// @ts-ignore no type for sentry loader
			window.Sentry.forceLoad()
		}
		return window.Sentry
	}

	getInstance().configureScope((scope: any) => {
		scope.addEventProcessor((event: any) => {
			if (biStore.isCached) {
				return null
			}
			event.release = process.env.browser ? window.thunderboltVersion : process.env.APP_VERSION
			event.environment = getEnvironment(viewerModel.fleetConfig.code)
			fedopsLogger.interactionStarted('error', { customParams: { errorMessage: event.message } }) // this is a workaround to get error rate until we will have support for postgresSQL in fedonomy
			if (!event.fingerprint) {
				const fingerprints = extractFingerprints(event.exception)
				event.fingerprint = [...fingerprints]
			}
			if (sessionErrorLimit) {
				sessionErrorLimit--
				return event
			}
			return null
		})
		scope.setUser({ viewerSessionId: wixBiSession.viewerSessionId })
		scope.setExtra('experiments', viewerModel.experiments)
		addTagsFromObject(scope, viewerModel.deviceInfo)
		addTagsFromObject(scope, {
			url: viewerModel.requestUrl,
			isSsr: !process.env.browser,
		})
	})

	const captureError = (error: Error, { tags, extras, groupErrorsBy = 'tags' }: any = {}) =>
		getInstance(true).withScope((scope: any) => {
			const fingerprints = []
			for (const key in tags) {
				if (tags.hasOwnProperty(key)) {
					scope.setTag(key, tags[key])
					if (groupErrorsBy === 'tags') {
						fingerprints.push(key)
					} else if (groupErrorsBy === 'values') {
						fingerprints.push(tags[key])
					}
				}
			}

			for (const key in extras) {
				if (extras.hasOwnProperty(key)) {
					scope.setExtra(key, extras[key])
				}
			}

			if (fingerprints.length) {
				const fileName = error.stack ? extractFileNameFromErrorStack(error.stack) : 'unknownFile'
				scope.setFingerprint([error.message, fileName, ...fingerprints])
			}
			if (sessionErrorLimit) {
				getInstance().captureException(error)
			}
			console.log(error) // Sentry capture exception swallows the error
		})
	const phaseMark = (phase: Phase) => {
		getInstance().addBreadcrumb({ message: 'phase:' + phase })
		fedopsLogger.appLoadingPhaseStart(phase)
	}
	const interactionStarted = (interaction: Interaction, interactionOptions?: IStartInteractionOptions) => {
		getInstance().addBreadcrumb({ message: 'interaction start: ' + interaction })
		fedopsLogger.interactionStarted(interaction, interactionOptions || {})
	}
	const interactionEnded = (interaction: Interaction, interactionOptions?: IEndInteractionOptions) => {
		getInstance().addBreadcrumb({ message: 'interaction end: ' + interaction })
		fedopsLogger.interactionEnded(interaction, interactionOptions || {})
	}
	if (process.env.browser) {
		window.fedops.phaseMark = phaseMark
	}

	return {
		reportAsyncWithCustomKey: <T>(asyncMethod: () => Promise<T>, methodName: string, key: string): Promise<T> => {
			// @ts-ignore FEDINF-1937 missing type
			interactionStarted(methodName, { customParam: { key } })
			return asyncMethod()
				.then(
					(res): Promise<T> => {
						// @ts-ignore FEDINF-1937 missing type
						interactionEnded(methodName, { customParam: { key } })
						return Promise.resolve(res)
					}
				)
				.catch((error) => {
					captureError(error, { tags: { methodName } })
					return Promise.reject(error)
				})
		},
		runAsyncAndReport: async <T>(
			asyncMethod: () => Promise<T>,
			methodName: string,
			reportExeception: boolean = true
		): Promise<T> => {
			try {
				interactionStarted(`${methodName}`)
				const fnResult = await asyncMethod()
				interactionEnded(`${methodName}`)
				return fnResult
			} catch (e) {
				if (reportExeception) {
					captureError(e, { tags: { methodName } })
				}
				throw e
			}
		},
		runAndReport: <T>(method: () => T, methodName: string): T => {
			interactionStarted(methodName)
			try {
				const t = method()
				interactionEnded(methodName)
				return t
			} catch (e) {
				captureError(e, { tags: { methodName } })
				throw e
			}
		},
		captureError,
		setGlobalsForErrors: ({ tags, extra, groupErrorsBy } = { groupErrorsBy: 'tags' }) =>
			getInstance().configureScope((scope: any) => {
				scope.addEventProcessor((event: any, hint: any) => {
					const { message } = hint.originalException
					const fingerprints = []

					if (shouldFilter(message)) {
						return null
					}

					for (const key in tags) {
						if (tags.hasOwnProperty(key)) {
							if (groupErrorsBy === 'tags') {
								fingerprints.push(key)
							} else if (groupErrorsBy === 'values') {
								fingerprints.push(tags[key])
							}
						}
					}

					if (extra) {
						event.extra = event.extra || {}
						Object.assign(event.extra, extra)
					}

					if (tags) {
						event.tags = event.tags || {}
						Object.assign(event.tags, tags)
					}

					if (fingerprints.length) {
						scope.setFingerprint(['{{ default }}', ...fingerprints])
					}

					return event
				})
			}),
		breadcrumb: (messageContent, additionalData = {}) =>
			getInstance().addBreadcrumb({
				message: messageContent,
				data: additionalData,
			}),
		interactionStarted,
		interactionEnded,
		phaseMark,
		reportAppLoadStarted: () => fedopsLogger.appLoadStarted(),
		appLoaded: () => fedopsLogger.appLoaded(),
	}
}

const rendererPropsExtender = withDependencies(
	[LoggerSymbol],
	(logger: ILogger): IRendererPropsExtender => {
		return {
			async extendRendererProps() {
				return { logger }
			},
		}
	}
)

export const site = ({ logger }: Environment): ContainerModuleLoader => (bind) => {
	bind(LoggerSymbol).toConstantValue(logger)
	bind(RendererPropsExtenderSym).to(rendererPropsExtender)
}

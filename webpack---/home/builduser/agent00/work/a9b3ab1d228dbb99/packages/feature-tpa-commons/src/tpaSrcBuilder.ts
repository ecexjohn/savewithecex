import { named, withDependencies, optional } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	BusinessLogger,
	BusinessLoggerSymbol,
	CurrentRouteInfoSymbol,
	IMultilingual,
	IPropsStore,
	Props,
	SiteFeatureConfigSymbol,
	WixBiSession,
	WixBiSessionSymbol,
} from '@wix/thunderbolt-symbols'
import { name } from './symbols'
import { ICurrentRouteInfo } from 'feature-router'
import { TpaCompData, ITpaSrcBuilder, BuildTpaSrcOptions, TpaInnerRouteConfig, TpaCommonsSiteConfig } from './types'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import { ConsentPolicySymbol, IConsentPolicy } from 'feature-consent-policy'
import { PolicyDetails } from '@wix/cookie-consent-policy-client'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'
import _ from 'lodash'
import { MultilingualSymbol } from 'feature-multilingual'
import { extractInnerRoute } from '@wix/thunderbolt-commons'

const appendInnerRoute = (parts: Array<string>, targetUrl: string) => {
	if (parts.length === 0) {
		return targetUrl
	}
	const innerRoute = parts.join('/')
	const addr = new URL(targetUrl)
	addr.pathname += `/${innerRoute}`
	return addr.href
}

const addConsentPolicyIfExists = (consentPolicyApi: IConsentPolicy) => {
	const consentPolicy = consentPolicyApi.getCurrentConsentPolicy()

	function isDefaultConsentPolicy(policytoTest: PolicyDetails) {
		return policytoTest.defaultPolicy && _.every(policytoTest.policy)
	}

	return !isDefaultConsentPolicy(consentPolicy) && !!consentPolicyApi._getConsentPolicyHeader()['consent-policy']
		? decodeURIComponent(consentPolicyApi._getConsentPolicyHeader()['consent-policy']!)
		: undefined
}

export const TpaSrcBuilder = withDependencies(
	[
		Props,
		named(SiteFeatureConfigSymbol, name),
		SessionManagerSymbol,
		ConsentPolicySymbol,
		BrowserWindowSymbol,
		CommonConfigSymbol,
		CurrentRouteInfoSymbol,
		BusinessLoggerSymbol,
		WixBiSessionSymbol,
		optional(MultilingualSymbol),
	],
	(
		props: IPropsStore,
		{
			widgetsClientSpecMapData,
			siteRevision,
			viewMode,
			appSectionParams,
			externalBaseUrl,
			requestUrl,
			extras,
			deviceType,
			tpaDebugParams,
			locale,
			timeZone,
		}: TpaCommonsSiteConfig,
		sessionManager: ISessionManager,
		consentPolicyApi: IConsentPolicy,
		browserWindow: BrowserWindow,
		commonConfigAPI: ICommonConfig,
		currentRouteInfo: ICurrentRouteInfo,
		businessLogger: BusinessLogger,
		biSession: WixBiSession,
		multiLingual?: IMultilingual
	): ITpaSrcBuilder => {
		const resolveCurrentUrl = () => {
			return browserWindow ? browserWindow.location.href : requestUrl
		}

		const resolveAppSectionParams = () => {
			if (browserWindow) {
				const json = new URL(resolveCurrentUrl()).searchParams.get('appSectionParams')
				return JSON.parse(decodeURIComponent(json || '{}')) || {}
			}
			return appSectionParams
		}

		const withTpaInnerRoute = (tpaUrl: string, applicationId: number, tpaInnerRouteConfig: TpaInnerRouteConfig) => {
			const hasTpaInnerRoute = Boolean(
				tpaInnerRouteConfig.tpaPageUri &&
					!_.isNil(applicationId) &&
					applicationId === tpaInnerRouteConfig.tpaApplicationId
			)

			const [rawPathname] = resolveCurrentUrl()
				.replace(externalBaseUrl, '')
				.split('?')

			const innerRouteParts = hasTpaInnerRoute && extractInnerRoute(rawPathname, tpaInnerRouteConfig.tpaPageUri)
			return innerRouteParts ? appendInnerRoute(innerRouteParts, tpaUrl) : tpaUrl
		}

		return {
			buildSrc(
				id: string,
				pageId: string,
				tpaCompData: Partial<TpaCompData>,
				baseUrl: string,
				partialOptions: Partial<BuildTpaSrcOptions> = {}
			) {
				const defaultOptions: BuildTpaSrcOptions = {
					tpaInnerRouteConfig: null,
					extraQueryParams: {},
					appDefinitionId: '',
				}

				const options = _.merge(defaultOptions, partialOptions)

				const { widgetId, width, height, externalId, templateId } = tpaCompData
				const widgetCSMData = widgetsClientSpecMapData[widgetId!] || {}
				const applicationId = widgetCSMData.applicationId
				const appDefinitionId = widgetCSMData.appDefinitionId || options.appDefinitionId

				const routerPublicData = currentRouteInfo.getCurrentRouteInfo()!.dynamicRouteData?.publicData
				// when templateCompId exists, it should be the compId passed to the tpa e.g in case the controller lives within a shared block
				// compId is still needed for js-sdk
				const compId = templateId || id
				const viewerCompId = id

				const commonConfig = JSON.stringify(commonConfigAPI.getCommonConfig())

				const currentUrl = new URL(resolveCurrentUrl())

				const urlQueryParams: Record<string, string | undefined | null> = {
					instance: sessionManager.getAppInstanceByAppDefId(appDefinitionId),
					pageId,
					compId,
					viewerCompId,
					siteRevision: `${siteRevision}`,
					viewMode,
					deviceType,
					externalId,
					locale,
					commonConfig,
					tz: timeZone,
					vsi: biSession.viewerSessionId,
					'consent-policy': addConsentPolicyIfExists(consentPolicyApi),
					currency: extras.currency,
					currentCurrency: currentUrl.searchParams.get('currency') || extras.currency,
					width: _.isNumber(width) ? `${width}` : null,
					height: _.isNumber(height) ? `${height}` : null,
					...resolveAppSectionParams(),
					...options.extraQueryParams,
				}

				if (multiLingual) {
					urlQueryParams.lang = multiLingual.currentLanguage?.languageCode
					urlQueryParams.dateNumberFormat = multiLingual.currentLanguage?.locale
					if (!_.isNil(multiLingual.isOriginalLanguage)) {
						urlQueryParams.isPrimaryLanguage = `${multiLingual.isOriginalLanguage}`
					}
				}

				if (routerPublicData) {
					urlQueryParams.routerData = JSON.stringify(routerPublicData)
				}

				_.entries(tpaDebugParams).forEach(([key, value]) => {
					if (!_.isNil(value)) {
						urlQueryParams[key] = value
					}
				})

				const targetSrc = options.tpaInnerRouteConfig
					? withTpaInnerRoute(baseUrl, applicationId, options.tpaInnerRouteConfig)
					: baseUrl
				const url = new URL(targetSrc)

				_.entries(urlQueryParams).forEach(([key, value]) => {
					if (!_.isNil(value)) {
						url.searchParams.set(key, value)
					}
				})
				return url.href
			},
		}
	}
)

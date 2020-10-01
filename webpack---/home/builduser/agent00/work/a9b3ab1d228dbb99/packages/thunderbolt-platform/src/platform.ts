import _ from 'lodash'
import { ICurrentRouteInfo, IRoutingLinkUtilsAPI, RoutingLinkUtilsAPISymbol, UrlHistoryManagerSymbol, IUrlHistoryManager } from 'feature-router'
import { IPageProvider, IPageReflector, PageProviderSymbol } from 'feature-pages'
import { IPopupsLinkUtilsAPI, PopupsLinkUtilsAPISymbol } from 'feature-popups'
import { multi, named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import { getCSRFToken } from '@wix/thunderbolt-commons'
import { SiteAssetsClientAdapter } from 'thunderbolt-site-assets-client'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	CompEventsRegistrarSym,
	ComponentsStylesOverridesSymbol,
	CurrentRouteInfoSymbol,
	Experiments,
	ExperimentsSymbol,
	IAppWillLoadPageHandler,
	ICompEventsRegistrar,
	IComponentsStylesOverrides,
	ILanguage,
	ILogger,
	IPropsStore,
	LanguageSymbol,
	LoggerSymbol,
	PlatformEnvDataProvider,
	PlatformEvnDataProviderSymbol,
	PlatformSiteConfig,
	PlatformStorageSymbol,
	Props,
	PropsMap,
	SdkHandlersProvider,
	SiteAssetsClientSym,
	SiteFeatureConfigSymbol,
	ViewerModel,
	ViewerModelSym,
	WixBiSession,
	WixBiSessionSymbol,
	WixCodeSdkHandlersProviderSym
} from '@wix/thunderbolt-symbols'
import { BootstrapData, IPlatform, PlatformInitializer, ViewerAPI } from './types'
import { name, PlatformInitializerSym } from './symbols'
import { IPlatformStorage } from './storage/storage'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'
import { DebugApis, TbDebugSymbol } from 'feature-debug'

export const Platform = withDependencies(
	[
		// prettier-ignore
		PlatformInitializerSym,
		named(SiteFeatureConfigSymbol, name),
		ViewerModelSym,
		Props,
		LoggerSymbol,
		WixBiSessionSymbol,
		SiteAssetsClientSym,
		CompEventsRegistrarSym,
		BrowserWindowSymbol,
		CurrentRouteInfoSymbol,
		UrlHistoryManagerSymbol,
		LanguageSymbol,
		ExperimentsSymbol,
		RoutingLinkUtilsAPISymbol,
		SessionManagerSymbol,
		optional(PopupsLinkUtilsAPISymbol),
		PageProviderSymbol,
		PlatformStorageSymbol,
		multi(WixCodeSdkHandlersProviderSym),
		CommonConfigSymbol,
		multi(PlatformEvnDataProviderSymbol),
		ComponentsStylesOverridesSymbol,
		optional(TbDebugSymbol)
	],
	(
		platformRunnerContext: PlatformInitializer,
		platformSiteConfig: PlatformSiteConfig,
		viewerModel: ViewerModel,
		propsStore: IPropsStore,
		logger: ILogger,
		wixBiSession: WixBiSession,
		siteAssetsClient: SiteAssetsClientAdapter,
		compEventsRegistrar: ICompEventsRegistrar,
		window: BrowserWindow,
		currentRouteInfo: ICurrentRouteInfo,
		urlHistoryManager: IUrlHistoryManager,
		language: ILanguage,
		experiments: Experiments,
		routingLinkUtilsAPI: IRoutingLinkUtilsAPI,
		sessionManager: ISessionManager,
		popupsLinkUtilsAPI: IPopupsLinkUtilsAPI,
		pageProvider: IPageProvider,
		storageAPI: IPlatformStorage,
		siteHandlersProviders: Array<SdkHandlersProvider>,
		commonConfigAPI: ICommonConfig,
		platformEnvDataProviders: Array<PlatformEnvDataProvider>,
		componentsStylesOverrides: IComponentsStylesOverrides,
		debugApi?: DebugApis
	): IAppWillLoadPageHandler & IPlatform => {
		const siteHandlers = siteHandlersProviders.map((siteHandlerProvider) => siteHandlerProvider.getSdkHandlers())
		function getHandlers(page: IPageReflector) {
			const pageHandlersProviders = page.getAllImplementersOf<SdkHandlersProvider>(WixCodeSdkHandlersProviderSym)
			const pageHandlers = pageHandlersProviders.map((pageHandlerProvider) => pageHandlerProvider.getSdkHandlers())
			return Object.assign({}, ...pageHandlers, ...siteHandlers)
		}

		function getPlatformEnvData() {
			return Object.assign({}, ...platformEnvDataProviders.map((envApiProvider) => envApiProvider.platformEnvData))
		}

		const {
			siteFeaturesConfigs,
			rollout,
			siteAssets,
			deviceInfo,
			site: { externalBaseUrl, siteRevision },
			mode
		} = viewerModel

		const { bootstrapData: siteConfigBootstrapData, landingPageId, isChancePlatformOnLandingPage, disablePlatform } = platformSiteConfig
		const popupPages = popupsLinkUtilsAPI?.getPopupPages()
		siteConfigBootstrapData.platformServicesAPIData.link.popupPages = popupPages
		const sdkFactoriesSiteFeatureConfigs = _.pickBy(siteFeaturesConfigs, (siteConfig, featureName) => featureName.toLowerCase().includes('wixcodesdk'))

		const bi = {
			..._.omit(wixBiSession, 'checkVisibility'),
			visitorId: sessionManager.getVisitorId(),
			siteMemberId: sessionManager.getSiteMemberId(), // TODO PLAT-988 this may change on login. need the sessionService in platform to sync it
			viewerVersion: process.env.browser ? window!.thunderboltVersion : process.env.APP_VERSION,
			rolloutData: rollout
		}

		const csrfToken = getCSRFToken(window)
		const siteAssetsClientInitParams = {
			...siteAssets,
			deviceInfo,
			siteAssetsClientConfig: siteAssetsClient.getInitConfig(),
			qaMode: mode.qa
		}

		let pageNumber = 0
		let wixCodeSdkProviderParams: Record<string, { initialState: any }>
		return {
			registerWixCodeSdkParams(wixCodeSdkParams: Record<string, any>) {
				wixCodeSdkProviderParams = wixCodeSdkParams
			},
			async appWillLoadPage({ pageId: currentPageId, contextId }) {
				const isLightbox = popupPages ? !!popupPages[currentPageId] : false
				if (!isLightbox) {
					pageNumber++
				}

				if (disablePlatform || (currentPageId === landingPageId && !isChancePlatformOnLandingPage)) {
					return
				}

				const routeInfo = currentRouteInfo.getCurrentRouteInfo()
				const { href, searchParams } = urlHistoryManager.getParsedUrl()

				const suppressBi = searchParams.has('suppressbi') && searchParams.get('suppressbi') !== 'false'
				const muteBi = (mode.qa || isLightbox || pageNumber !== 1 || suppressBi) && !experiments.sv_reportTrace
				if (!muteBi) {
					logger.interactionStarted('platform')
				}

				const handlersPromise = Promise.all([pageProvider(contextId), pageProvider('masterPage')]).then(([page, masterPage]) => ({
					masterPageHandlers: getHandlers(masterPage),
					pageHandlers: getHandlers(page)
				}))

				const wixCodeSdkProviderData = _.mapValues(wixCodeSdkProviderParams, 'initialState')

				const biPageData = {
					pageNumber,
					pageId: currentPageId,
					pageUrl: href,
					isLightbox
				}

				const applicationsInstances = sessionManager.getAllInstances()

				const bootstrapData: BootstrapData = {
					externalBaseUrl,
					routingInfo: routingLinkUtilsAPI.getLinkUtilsRoutingInfo(),
					csrfToken,
					siteRevision,
					currentPageId,
					currentContextId: contextId,
					pageJsonFileName: routeInfo?.pageJsonFileName || '',
					wixCodeSdkProviderData,
					siteAssetsClientInitParams,
					experiments,
					applicationsInstances,
					mode,
					commonConfig: commonConfigAPI.getCommonConfig(),
					storageInitData: storageAPI.getStore(),
					routerReturnedData: routeInfo?.dynamicRouteData ?? null,
					platformEnvData: { bi: { ...bi, pageData: biPageData, muteBi }, ...getPlatformEnvData() }, // getting envData each navigation for currentUrl
					sdkFactoriesSiteFeatureConfigs,
					...siteConfigBootstrapData
				}

				const viewerAPI: ViewerAPI = {
					updateProps(partialProps: PropsMap): void {
						propsStore.update(partialProps)
					},
					updateStyles: (overrideStyles: { [compId: string]: object }) => {
						const omittedNilValuse = _({})
							.merge(componentsStylesOverrides.getAllStyles(), overrideStyles)
							.mapValues((compStyles) => _.omitBy(compStyles, _.isNil))
							.omitBy(_.isEmpty)
							.value()
						componentsStylesOverrides.set(omittedNilValuse as {})
					},
					invokeSdkHandler: async (pageId: string, functionName: string, ...args: any) => {
						const { masterPageHandlers, pageHandlers } = await handlersPromise
						const handlers = pageId === 'masterPage' ? masterPageHandlers : pageHandlers
						if (!_.isFunction(handlers[functionName])) {
							logger.captureError(new Error('handler does not exists in page'), {
								tags: { platform: true },
								extras: { functionName, pageId, contextId }
							})
							return
						}
						return handlers[functionName](...args)
					}
				}

				if (debugApi) {
					debugApi.platform.logBootstrapMessage(contextId, bootstrapData)
				}
				await platformRunnerContext.init(bootstrapData, viewerAPI)
				if (!muteBi) {
					logger.interactionEnded('platform')
				}
			}
		}
	}
)

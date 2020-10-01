import { multi, named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CurrentRouteInfoSymbol,
	IAppWillLoadPageHandler,
	IPageWillUnmountHandler,
	IAppDidLoadPageHandler,
	IStructureAPI,
	LifeCycle,
	SiteFeatureConfigSymbol,
	StructureAPI,
	BISymbol,
	BIReporter,
	LoggerSymbol,
	ILogger,
	MasterPageFeatureConfigSymbol,
	InternalNavigationType,
	BrowserWindowSymbol,
	BrowserWindow,
} from '@wix/thunderbolt-symbols'
import { resolveUrl } from './resolveUrl'
import { name, RoutingMiddleware, UrlHistoryManagerSymbol, CustomUrlMiddlewareSymbol } from './symbols'
import {
	ICurrentRouteInfo,
	IRoutingMiddleware,
	IRouter,
	IRoutingConfig,
	RouteInfo,
	IUrlHistoryManager,
	RouterMasterPageConfig,
	NavigationParams,
	CandidateRouteInfo,
} from './types'
import { getInnerMiddleware } from './innerMiddleware'
import { PageTransitionsCompletedSymbol, IPageTransitionsCompleted } from 'feature-page-transitions'
import { IPageProvider, IPageReflector, PageProviderSymbol } from 'feature-pages'
import { isSSR, taskify } from '@wix/thunderbolt-commons'
import { reportNavigationEnd, reportNavigationStart } from './navigationMonitoring'

const emptyMiddleware: IRoutingMiddleware = {
	handle: async (routeInfo) => routeInfo,
}

const onPageTransitionsCompleted = (pageId: string, contextId: string, pageReflector: IPageReflector) => {
	const handlers = pageReflector.getAllImplementersOf<IAppDidLoadPageHandler>(LifeCycle.AppDidLoadPageHandler)
	const [pageTransitionsImp] = pageReflector.getAllImplementersOf<IPageTransitionsCompleted>(
		PageTransitionsCompletedSymbol
	)

	if (pageTransitionsImp) {
		pageTransitionsImp.onPageTransitionsCompleted(() => {
			handlers.map((handler) => handler.appDidLoadPage({ pageId, contextId }))
		})
	} else {
		handlers.map((handler) => handler.appDidLoadPage({ pageId, contextId }))
	}
}

const getContextId = ({ type, pageId, relativeUrl }: CandidateRouteInfo): string => {
	const [, additionalRoute] = relativeUrl?.match(/\.\/.*?\/(.*$)/) || []
	return type === 'Dynamic' && additionalRoute ? `${pageId}_${additionalRoute}` : pageId
}

const notifyPageWillUnmount = async (routeInfo: RouteInfo, pageProvider: IPageProvider) => {
	const { contextId, pageId } = routeInfo
	const pageReflector = await pageProvider(contextId, pageId)
	const handlers = pageReflector.getAllImplementersOf<IPageWillUnmountHandler>(LifeCycle.PageWillUnmountHandler)
	await Promise.all(handlers.map((handler) => handler.pageWillUnmount({ pageId, contextId })))
}

const routerFactory = (
	routingConfig: IRoutingConfig,
	routingMasterPageConfig: RouterMasterPageConfig,
	structureApi: IStructureAPI,
	pageProvider: IPageProvider,
	customUrlMiddleware: IRoutingMiddleware = emptyMiddleware,
	dynamicRoutingMiddleware: IRoutingMiddleware = emptyMiddleware,
	protectedRoutingMiddleware: IRoutingMiddleware = emptyMiddleware,
	appWillLoadPageHandlers: Array<IAppWillLoadPageHandler>,
	currentRouteInfo: ICurrentRouteInfo,
	urlHistoryManager: IUrlHistoryManager,
	biReporter: BIReporter,
	logger: ILogger,
	window: BrowserWindow
): IRouter => {
	const handleStaticRoute = async (routeInfo: CandidateRouteInfo) => {
		currentRouteInfo.updateCurrentRouteInfo(routeInfo)
		urlHistoryManager.pushUrlState(routeInfo.parsedUrl)

		const { contextId, pageId } = routeInfo
		// Create the reflector for the pageId with the contextId
		const pageReflectorPromise = pageProvider(contextId, pageId)
		await Promise.all(
			appWillLoadPageHandlers.map((handler) => taskify(() => handler.appWillLoadPage({ pageId, contextId })))
		)

		const pageReflector = await pageReflectorPromise
		await structureApi.addPageAndRootToRenderedTree(pageId)

		onPageTransitionsCompleted(pageId, contextId, pageReflector)

		return routeInfo
	}

	const handleSamePageNavigation = async (
		currentRoute: RouteInfo | null,
		finalRouteInfo: CandidateRouteInfo,
		skipHistory?: boolean
	) => {
		currentRouteInfo.updateCurrentRouteInfo(finalRouteInfo)
		urlHistoryManager.pushUrlState(finalRouteInfo.parsedUrl, skipHistory)

		if (!isSSR(window)) {
			window!.scrollTo({ top: 0 })
			const targetElement = window!.document.getElementById('SCROLL_TO_TOP')
			// eslint-disable-next-line no-unused-expressions
			targetElement?.focus()
		}

		reportNavigationEnd(currentRoute, finalRouteInfo, InternalNavigationType.INNER_ROUTE, biReporter, logger)
	}

	const { customNotFoundPageMiddleware, pageJsonFileNameMiddleware } = getInnerMiddleware(routingConfig)

	let redirectCounter = 0

	const navigate = async (url: string, navigationParams?: NavigationParams): Promise<boolean> => {
		const currentRoute = currentRouteInfo.getCurrentRouteInfo()
		if (currentRoute && url === urlHistoryManager.getRelativeUrl()) {
			currentRouteInfo.updateCurrentRouteInfo({ ...currentRoute, anchorDataId: navigationParams?.anchorDataId })
			return false
		}

		let routeInfo: Partial<CandidateRouteInfo> | null = resolveUrl(
			url,
			routingConfig,
			urlHistoryManager.getParsedUrl()
		)

		reportNavigationStart(currentRoute, routeInfo, biReporter, logger)

		routeInfo = await customUrlMiddleware.handle(routeInfo)

		routeInfo = routeInfo && (await dynamicRoutingMiddleware.handle(routeInfo))

		if (routeInfo && routeInfo.redirectUrl) {
			if (redirectCounter < 4) {
				redirectCounter++
				reportNavigationEnd(
					currentRoute,
					routeInfo,
					InternalNavigationType.DYNAMIC_REDIRECT,
					biReporter,
					logger
				)
				return navigate(routeInfo.redirectUrl)
			}
			redirectCounter = 0
			reportNavigationEnd(currentRoute, routeInfo, InternalNavigationType.DYNAMIC_REDIRECT, biReporter, logger)
			return false
		} else {
			redirectCounter = 0
		}

		routeInfo = routeInfo && (await customNotFoundPageMiddleware.handle(routeInfo))
		routeInfo = routeInfo && (await pageJsonFileNameMiddleware.handle(routeInfo))
		routeInfo = routeInfo && (await protectedRoutingMiddleware.handle(routeInfo))

		if (!routeInfo) {
			reportNavigationEnd(currentRoute, routeInfo, InternalNavigationType.NAVIGATION_ERROR, biReporter, logger)
			return false
		}

		if (!routeInfo.pageJsonFileName) {
			reportNavigationEnd(currentRoute, routeInfo, InternalNavigationType.NAVIGATION_ERROR, biReporter, logger)
			throw new Error(`did not find the json file name for pageId ${routeInfo.pageId}`)
		}

		if (navigationParams?.anchorDataId) {
			routeInfo.anchorDataId = navigationParams?.anchorDataId
		}

		routeInfo.contextId = getContextId(routeInfo as CandidateRouteInfo)

		const finalRouteInfo = routeInfo as CandidateRouteInfo

		const isTpaSamePageNavigation = currentRoute?.pageId === finalRouteInfo.pageId && routeInfo.type === 'Static'
		if (isTpaSamePageNavigation) {
			handleSamePageNavigation(currentRoute, finalRouteInfo, navigationParams?.skipHistory)
			return false
		}

		if (currentRoute) {
			await notifyPageWillUnmount(currentRoute, pageProvider)
		}
		await handleStaticRoute(finalRouteInfo)
		reportNavigationEnd(currentRoute, finalRouteInfo, InternalNavigationType.NAVIGATION, biReporter, logger)
		return true
	}

	const isInternalRoute = (url: string): boolean => {
		const { type, relativeUrl, pageId } = resolveUrl(url, routingConfig)
		switch (type) {
			case 'Dynamic':
				return true
			case 'Static':
				// Static page with inner route is supported only in tpa pages
				return !!(relativeUrl!.split('/').length === 2 || routingMasterPageConfig.tpaSectionPageIds[pageId!])
			default:
				return false
		}
	}

	return {
		navigate,
		isInternalRoute,
	}
}

export const Router = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		StructureAPI,
		PageProviderSymbol,
		CustomUrlMiddlewareSymbol,
		optional(RoutingMiddleware.Dynamic),
		optional(RoutingMiddleware.Protected),
		multi(LifeCycle.AppWillLoadPageHandler),
		CurrentRouteInfoSymbol,
		UrlHistoryManagerSymbol,
		BISymbol,
		LoggerSymbol,
		BrowserWindowSymbol,
	],
	routerFactory
)

import {
	RoutingMiddleware,
	Router as RouterSymbol,
	UrlHistoryManagerSymbol,
	UrlChangeHandlerForPage,
	PopHistoryStateHandler,
	RoutingLinkUtilsAPISymbol,
	CustomUrlMiddlewareSymbol,
} from './symbols'
import {
	LifeCycle,
	CurrentRouteInfoSymbol,
	NavigationClickHandlerSymbol,
	SamePageUrlChangeListenerSymbol,
} from '@wix/thunderbolt-symbols'
import { Router } from './router'
import { RouterInitAppWillMount, RouterInitOnPopState } from './routerInit'
import { resolveUrl } from './resolveUrl'
import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { NavigationClickHandler } from './navigationClickHandler'
import { CurrentRouteInfo } from './currentRouteInfo'
import { RoutingLinkUtilsAPI } from './routingPlatfromLinkUtilsAPI'
import { UrlHistoryManager, PopStateListener, UrlChangeListener } from './urlManager'
import {
	IUrlHistoryManager,
	IUrlChangeHandler,
	IRouter,
	IRoutingConfig,
	RouteInfo,
	IRoutingMiddleware,
	ICurrentRouteInfo,
	IRoutingLinkUtilsAPI,
	DynamicPagesAPI,
	FetchParams,
	CandidateRouteInfo,
} from './types'
import { CustomUrlMiddleware } from './customUrlMiddleware'

// Public loader
export const site: ContainerModuleLoader = (bind, bindAll) => {
	bind(RouterSymbol).to(Router)
	bind(CustomUrlMiddlewareSymbol).to(CustomUrlMiddleware)
	bind(LifeCycle.AppWillMountHandler).to(RouterInitAppWillMount)
	bind(PopHistoryStateHandler).to(RouterInitOnPopState)
	bind(RoutingLinkUtilsAPISymbol).to(RoutingLinkUtilsAPI)
	bind(NavigationClickHandlerSymbol).to(NavigationClickHandler)
	bind(CurrentRouteInfoSymbol).to(CurrentRouteInfo)
	bind(LifeCycle.AppWillMountHandler).to(PopStateListener)
	bind(SamePageUrlChangeListenerSymbol).to(UrlChangeListener)
	bindAll([UrlHistoryManagerSymbol, LifeCycle.AppWillLoadPageHandler], UrlHistoryManager)
}

// Public Symbols
export {
	RouterSymbol as Router,
	RoutingMiddleware,
	NavigationClickHandlerSymbol,
	UrlChangeHandlerForPage,
	UrlHistoryManagerSymbol,
	PopHistoryStateHandler,
	RoutingLinkUtilsAPISymbol,
}

// Public Types
export {
	IRouter,
	IRoutingConfig,
	IRoutingMiddleware,
	RouteInfo,
	CandidateRouteInfo,
	ICurrentRouteInfo,
	IUrlHistoryManager,
	IUrlChangeHandler,
	IRoutingLinkUtilsAPI,
	DynamicPagesAPI,
	FetchParams,
}

// Public Utils
export { resolveUrl }

export const Router = Symbol('Router')
export const RoutingMiddleware = {
	Dynamic: Symbol('DynamicRoutingMiddleware'),
	Protected: Symbol('ProtectedRoutingMiddleware'),
}
export const CustomUrlMiddlewareSymbol = Symbol('CustomUrlMiddleware')
export const RoutingLinkUtilsAPISymbol = Symbol('RoutingLinkUtilsAPI')
export const PopHistoryStateHandler = Symbol('PopHistoryStateHandler')
export const UrlChangeHandlerForPage = Symbol('UrlChangeHandlerForPage')
export const UrlHistoryManagerSymbol = Symbol('UrlHistoryManager')

export const name = 'router' as const

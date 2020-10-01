import { withDependencies, optional, named } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { CustomUrlMapperSymbol, ICustomUrlMapper } from 'feature-custom-url-mapper'
import { IRoutingMiddleware, IRoutingConfig, CandidateRouteInfo } from './types'
import { name } from './symbols'

const customUrlMiddleware = (customUrlMapper: ICustomUrlMapper, routingConfig: IRoutingConfig): IRoutingMiddleware => ({
	handle: async (routeInfo: CandidateRouteInfo) => {
		const { routes, isWixSite }: { routes: IRoutingConfig['routes']; isWixSite: boolean } = routingConfig

		// If the routeInfo has a type it means that this is a familiar Static or Dynamic route.
		if (routeInfo.type) {
			return routeInfo
		}

		const mainPageRoute = './'
		const defaultRoute = isWixSite && mainPageRoute

		const customRoute = customUrlMapper?.getUrlPageRoute(routeInfo?.relativeUrl)
		const currentRoute = customRoute ?? defaultRoute
		return { ...routeInfo, ...routes[currentRoute] }
	},
})

export const CustomUrlMiddleware = withDependencies(
	[optional(CustomUrlMapperSymbol), named(SiteFeatureConfigSymbol, name)],
	customUrlMiddleware
)

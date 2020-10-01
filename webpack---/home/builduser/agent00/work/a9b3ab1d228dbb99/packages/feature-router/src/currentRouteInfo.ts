import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { getRelativeUrl } from './resolveUrl'
import { ICurrentRouteInfo, IRoutingConfig, CandidateRouteInfo } from './types'
import { SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { name } from './symbols'

const currentRouteInfo = (routingConfig: IRoutingConfig): ICurrentRouteInfo => {
	let routeInfo: CandidateRouteInfo
	let prevRouteInfo: CandidateRouteInfo | null = null

	return {
		getCurrentRouteInfo: () => {
			return routeInfo ? routeInfo : null
		},
		getPreviousRouterInfo: () => {
			return prevRouteInfo
		},
		updateCurrentRouteInfo: (nextRouteInfo: CandidateRouteInfo) => {
			prevRouteInfo = routeInfo
			routeInfo = nextRouteInfo
		},
		updateRouteInfoUrl: (parsedUrl: URL) => {
			if (routeInfo) {
				routeInfo.parsedUrl = parsedUrl
				routeInfo.relativeUrl = getRelativeUrl(parsedUrl.href, routingConfig.baseUrl)
			}
		},
	}
}

export const CurrentRouteInfo = withDependencies([named(SiteFeatureConfigSymbol, name)], currentRouteInfo)

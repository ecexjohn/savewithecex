import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { CurrentRouteInfoSymbol, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { name, UrlHistoryManagerSymbol } from './symbols'
import { ICurrentRouteInfo, IRoutingConfig, IRoutingLinkUtilsAPI, IUrlHistoryManager } from './types'
import { resolveUrl } from './resolveUrl'

const RoutingLinkUtilsAPIFactory = (
	routingConfig: IRoutingConfig,
	urlHistoryManager: IUrlHistoryManager,
	currentRouteInfo: ICurrentRouteInfo
): IRoutingLinkUtilsAPI => {
	return {
		getLinkUtilsRoutingInfo() {
			const { pageId } =
				currentRouteInfo.getCurrentRouteInfo() ||
				resolveUrl(urlHistoryManager.getParsedUrl().href, routingConfig)

			return {
				mainPageId: routingConfig.mainPageId,
				routes: routingConfig.routes,
				pageId: pageId!,
				relativeUrl: urlHistoryManager.getRelativeUrl(),
			}
		},
	}
}
export const RoutingLinkUtilsAPI = withDependencies(
	[named(SiteFeatureConfigSymbol, name), UrlHistoryManagerSymbol, CurrentRouteInfoSymbol],
	RoutingLinkUtilsAPIFactory
)

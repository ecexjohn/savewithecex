import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { PageFeatureConfigSymbol, IAppDidLoadPageHandler, CurrentRouteInfoSymbol } from '@wix/thunderbolt-symbols'
import { ScrollToAnchorPageConfig } from './types'
import { name } from './symbols'
import { WindowScrollApiSymbol, IWindowScrollAPI } from 'feature-window-scroll'
import { ICurrentRouteInfo } from 'feature-router'
import { TOP_AND_BOTTOM_ANCHORS } from './constants'

const postNavigationScrollFactory = (
	{ nicknameToCompIdMap, anchorDataIdToCompIdMap }: ScrollToAnchorPageConfig,
	routeInfo: ICurrentRouteInfo,
	windowScrollApi: IWindowScrollAPI
): IAppDidLoadPageHandler => {
	return {
		appDidLoadPage: () => {
			const currentRouteInfo = routeInfo.getCurrentRouteInfo()
			const anchorDataId = currentRouteInfo && currentRouteInfo.anchorDataId
			if (anchorDataId) {
				const isTopBottomAnchor = TOP_AND_BOTTOM_ANCHORS.includes(anchorDataId)
				const compId = isTopBottomAnchor
					? anchorDataId
					: anchorDataIdToCompIdMap[anchorDataId] || nicknameToCompIdMap[anchorDataId]
				windowScrollApi.scrollToComponent(compId)
			}
		},
	}
}

export const PostNavigationScroll = withDependencies(
	[named(PageFeatureConfigSymbol, name), CurrentRouteInfoSymbol, WindowScrollApiSymbol],
	postNavigationScrollFactory
)

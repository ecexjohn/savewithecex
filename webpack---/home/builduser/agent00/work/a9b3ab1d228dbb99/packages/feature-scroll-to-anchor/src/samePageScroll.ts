import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { PageFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { WindowScrollApiSymbol, IWindowScrollAPI } from 'feature-window-scroll'
import { TOP_AND_BOTTOM_ANCHORS } from './constants'
import { name } from './symbols'
import { ISamePageScroll, ScrollToAnchorPageConfig } from './types'

export const samePageScrollFactory = (
	{ anchorDataIdToCompIdMap }: ScrollToAnchorPageConfig,
	windowScrollApi: IWindowScrollAPI
): ISamePageScroll => ({
	scrollToAnchor: ({ anchorCompId, anchorDataId }) => {
		if (anchorDataId && TOP_AND_BOTTOM_ANCHORS.includes(anchorDataId)) {
			windowScrollApi.scrollToComponent(anchorDataId)
			return true
		}
		if (anchorCompId) {
			windowScrollApi.scrollToComponent(anchorCompId)
			return true
		}
		if (anchorDataId && anchorDataIdToCompIdMap[anchorDataId]) {
			// in responsive the anchorData doesn't include the comp id
			windowScrollApi.scrollToComponent(anchorDataIdToCompIdMap[anchorDataId])
			return true
		}

		return false
	},
})

export const SamePageScroll = withDependencies(
	[named(PageFeatureConfigSymbol, name), WindowScrollApiSymbol],
	samePageScrollFactory
)

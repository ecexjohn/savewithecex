import { withDependencies } from '@wix/thunderbolt-ioc'
import { ILinkClickHandler } from '@wix/thunderbolt-symbols'
import { ISamePageScroll } from './types'
import { SamePageScrollSymbol } from './symbols'
import { IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'

export const samePageScrollClickHandlerFactory = (
	samePageScroll: ISamePageScroll,
	urlHistoryManager: IUrlHistoryManager
): ILinkClickHandler => ({
	handleClick: (anchor) => {
		const anchorCompId = anchor.getAttribute('data-anchor-comp-id') || ''
		const anchorDataId = anchor.getAttribute('data-anchor') || ''

		const relativeUrl = urlHistoryManager.getRelativeUrl()
		const isCurrentPageNavigation = relativeUrl === anchor.getAttribute('href')
		if (!anchorCompId && !anchorDataId && isCurrentPageNavigation) {
			// Need to scroll to top of the page if anchor href is for current page
			return samePageScroll.scrollToAnchor({ anchorDataId: 'SCROLL_TO_TOP' })
		}

		return samePageScroll.scrollToAnchor({ anchorDataId, anchorCompId })
	},
})

export const SamePageScrollClickHandler = withDependencies(
	[SamePageScrollSymbol, UrlHistoryManagerSymbol],
	samePageScrollClickHandlerFactory
)

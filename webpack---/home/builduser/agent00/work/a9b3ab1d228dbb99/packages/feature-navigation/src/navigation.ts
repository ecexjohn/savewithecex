import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol, IStructureAPI, StructureAPI } from '@wix/thunderbolt-symbols'
import { INavigation } from './types'
import { Router as RouterSymbol, IRouter, IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'
import { isSSR } from '@wix/thunderbolt-commons'
import { IPopups, PopupsSymbol } from 'feature-popups'
import { SamePageScrollSymbol, ISamePageScroll } from 'feature-scroll-to-anchor'

const navigationFactory = (
	window: BrowserWindow,
	router: IRouter,
	urlManager: IUrlHistoryManager,
	samePageScroll: ISamePageScroll,
	structureApi: IStructureAPI,
	popups?: IPopups
): INavigation => {
	return {
		navigateTo: async (linkProps, navigationParams) => {
			if (isSSR(window)) {
				return false
			}
			const { href, target, linkPopupId, anchorDataId, anchorCompId } = linkProps

			// PopupPageLink
			if (linkPopupId) {
				popups!.openPopupPage(linkPopupId)
				return true
			}

			const isRelativeUrl = href!.startsWith('./')
			if (!isRelativeUrl) {
				// DocumentLink, PhoneLink, EmailLink, ExternalLink
				window.open(href, target)
				return true
			}

			// PageLink, DynamicPageLink, different page AnchorLink
			const currentRelativeUrl = urlManager.getRelativeUrl()
			const didNavigateToDifferentPage =
				currentRelativeUrl !== href &&
				(await router.navigate(href!, { anchorDataId, skipHistory: navigationParams?.skipHistory }))

			if (didNavigateToDifferentPage) {
				return true
			}

			// Same page AnchorLink
			if (anchorCompId || anchorDataId) {
				if (anchorCompId && !structureApi.get(anchorCompId)) {
					// anchor not on page
					return false
				}
				return samePageScroll.scrollToAnchor({ anchorCompId, anchorDataId })
			}

			if (href) {
				const currentParsedUrl = urlManager.getParsedUrl()
				const nextParsedUrl = new URL(href, currentParsedUrl.origin)
				if (nextParsedUrl.search) {
					nextParsedUrl.searchParams.forEach((val, key) => currentParsedUrl?.searchParams.set(key, val))
					// TODO: move the keep internal query params to the urlManager, so that the referrer will go
					urlManager.pushUrlState(currentParsedUrl)
				}

				// if same page navigation and popup is open we should close it
				if (popups?.getCurrentPopupId()) {
					popups.closePopupPage()
					return true
				}

				// Same page navigation with no anchors should scroll to top
				return samePageScroll.scrollToAnchor({ anchorDataId: 'SCROLL_TO_TOP' })
			}
			return false
		},
	}
}

export const Navigation = withDependencies(
	[
		BrowserWindowSymbol,
		RouterSymbol,
		UrlHistoryManagerSymbol,
		SamePageScrollSymbol,
		StructureAPI,
		optional(PopupsSymbol),
	],
	navigationFactory
)

import { optional, withDependencies, named } from '@wix/thunderbolt-ioc'
import { INavigation, NavigationSymbol } from 'feature-navigation'
import { createLinkUtils } from '@wix/thunderbolt-commons'
import { SiteFeatureConfigSymbol, TpaHandlerProvider, StructureAPI, IStructureAPI } from '@wix/thunderbolt-symbols'
import { IRoutingLinkUtilsAPI, RoutingLinkUtilsAPISymbol } from 'feature-router'
import { IPopupsLinkUtilsAPI, PopupsLinkUtilsAPISymbol } from 'feature-popups'
import { LinkData, PageLinkData } from '@wix/thunderbolt-becky-types'
import { PageTransitionsSymbol, IPageTransition } from 'feature-page-transitions'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type NavigateToMessageData = {
	link: LinkData
}

export type NavigateToAnchorMessageData = {
	anchorId: string
}

export type NavigateToPageMessageData = {
	pageId: string
	anchorId?: string
	noTransition?: boolean
}

export type NavigateToComponentMessageData = {
	compId: string
	pageId?: string
	noPageTransition?: boolean
}

export const NavigateToHandler = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		NavigationSymbol,
		RoutingLinkUtilsAPISymbol,
		StructureAPI,
		optional(PopupsLinkUtilsAPISymbol),
		optional(PageTransitionsSymbol),
	],
	(
		{ metaSiteId, userFileDomainUrl, routersConfig, isPremiumDomain }: TpaCommonsSiteConfig,
		navigation: INavigation,
		routingLinkUtilsAPI: IRoutingLinkUtilsAPI,
		structureApi: IStructureAPI,
		popupsLinkUtilsAPI?: IPopupsLinkUtilsAPI,
		pageTransitions?: IPageTransition
	): TpaHandlerProvider => {
		const linkUtils = createLinkUtils({
			routingInfo: routingLinkUtilsAPI.getLinkUtilsRoutingInfo(),
			metaSiteId,
			isPremiumDomain,
			userFileDomainUrl,
			routersConfig,
			popupPages: popupsLinkUtilsAPI?.getPopupPages(),
		})

		const getLinkProps = (link: LinkData) => {
			const linkUrl = linkUtils.getLinkUrlFromDataItem(link)
			return linkUtils.getLinkProps(linkUrl)
		}

		const getNavigateToPageLinkData = ({ pageId, anchorId }: { pageId: string; anchorId?: string }) => {
			const pageLinkData: PageLinkData = { type: 'PageLink', pageId, target: '_self' }
			const linkProps = getLinkProps(pageLinkData)

			if (anchorId) {
				if (routingLinkUtilsAPI.getLinkUtilsRoutingInfo().pageId === pageId) {
					linkProps.anchorCompId = anchorId
				} else {
					linkProps.anchorDataId = anchorId
				}
			}
			return linkProps
		}

		const navigateToPage = ({
			pageId,
			anchorId,
			noTransition,
		}: {
			pageId: string
			anchorId?: string
			noTransition?: boolean
		}) => {
			const linkProps = getNavigateToPageLinkData({ pageId, anchorId })

			if (noTransition && pageTransitions) {
				pageTransitions.disableNextTransition()
			}

			return navigation.navigateTo(linkProps)
		}

		return {
			getTpaHandlers() {
				return {
					navigateToPage(_compId: string, { pageId, anchorId, noTransition }: NavigateToPageMessageData) {
						navigateToPage({ pageId, anchorId, noTransition })
					},
					navigateTo(_compId: string, { link }: NavigateToMessageData) {
						const linkProps = getLinkProps(link)
						navigation.navigateTo(linkProps)
					},
					async navigateToAnchor(_compId: string, { anchorId }: NavigateToAnchorMessageData) {
						const didNavigate = await navigateToPage({
							pageId: routingLinkUtilsAPI.getLinkUtilsRoutingInfo().pageId,
							anchorId,
						})
						if (!didNavigate) {
							throw new Error(`anchor with id "${anchorId}" was not found on the current page.`)
						}
					},
					async navigateToComponent(
						_compId: string,
						{ compId, pageId: targetPageId, noPageTransition }: NavigateToComponentMessageData
					) {
						const page = targetPageId || routingLinkUtilsAPI.getLinkUtilsRoutingInfo().pageId
						const didNavigate = await navigateToPage({
							pageId: page,
							anchorId: compId,
							noTransition: noPageTransition,
						})
						if (!didNavigate) {
							throw new Error(`Page id "${page}" does not contain the component id "${compId}".`)
						}
					},
				}
			},
		}
	}
)

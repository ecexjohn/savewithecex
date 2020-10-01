import _ from 'lodash'
import { name } from '../symbols'
import { named, withDependencies, optional } from '@wix/thunderbolt-ioc'
import { createLinkUtils } from '@wix/thunderbolt-commons'
import { IRoutingLinkUtilsAPI, RoutingLinkUtilsAPISymbol } from 'feature-router'
import { IPopupsLinkUtilsAPI, PopupsLinkUtilsAPISymbol } from 'feature-popups'
import { TpaMasterPageConfig } from '../types'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import {
	MasterPageFeatureConfigSymbol,
	SiteFeatureConfigSymbol,
	TpaHandlerProvider,
	ExperimentsSymbol,
	Experiments,
} from '@wix/thunderbolt-symbols'

export type SiteMapResponse = Array<SiteMapLink>
export type SitePagesResponse = Array<SitePageLink>
export const MULTI_SECTION_DELIMITER = '$TPA$'
export const LINK_TYPES = {
	PAGE_LINK: 'PageLink',
	EXTERNAL_LINK: 'ExternalLink',
	ANCHOR_LINK: 'AnchorLink',
	LOGIN_TO_WIX_LINK: 'LoginToWixLink',
	EMAIL_LINK: 'EmailLink',
	PHONE_LINK: 'PhoneLink',
	WHATSAPP_LINK: 'WhatsAppLink',
	DOCUMENT_LINK: 'DocumentLink',
	SWITCH_MOBILE_VIEW_MODE: 'SwitchMobileViewMode',
	DYNAMIC_PAGE_LINK: 'DynamicPageLink',
	ADDRESS_LINK: 'AddressLink',
	MENU_HEADER: 'MenuHeader',
}

export const LINK_PANEL_PROPS = {
	[LINK_TYPES.PAGE_LINK]: ['type', 'pageId'],
	[LINK_TYPES.EXTERNAL_LINK]: ['type', 'target', 'url'],
	[LINK_TYPES.ANCHOR_LINK]: ['type', 'anchorName', 'anchorDataId', 'pageId'],
	[LINK_TYPES.EMAIL_LINK]: ['type', 'recipient', 'subject'],
	[LINK_TYPES.PHONE_LINK]: ['type', 'phoneNumber'],
	[LINK_TYPES.WHATSAPP_LINK]: ['type', 'phoneNumber'],
	[LINK_TYPES.DOCUMENT_LINK]: ['type', 'docId', 'name'],
	[LINK_TYPES.DYNAMIC_PAGE_LINK]: ['type', 'routerId', 'innerRoute', 'anchorDataId'],
	[LINK_TYPES.ADDRESS_LINK]: ['type', 'address'],
}

export type SiteMapLink = {
	type?: string
	hidden?: boolean
	isHomePage?: boolean
	pageId?: string
	title?: string
	url?: string
	docId?: string
	name?: string
	subPages?: Array<SiteMapLink>
	routerId?: string
	innerRoute?: string
	target?: string
	anchorName?: string
	anchorDataId?: string
	phoneNumber?: string
	recipient?: string
	subject?: string
}

export type SitePageLink = {
	hide?: boolean
	id?: string | boolean
	isHomepage?: boolean
	title?: string
	url?: string
}

export type Link = {
	type?: string
	pageId?: {
		id?: string
		tpaPageId: string
		tpaApplicationId: number
	}

	anchorDataId?:
		| string
		| {
				id: string
		  }
}

function isPageMarkedAsHideFromMenu(
	appsClientSpecMapByApplicationId: TpaCommonsSiteConfig['appsClientSpecMapByApplicationId'],
	linkObject: Link
) {
	if (!linkObject) {
		return false
	}
	if (linkObject.type === LINK_TYPES.PAGE_LINK) {
		let tpaPageId = linkObject.pageId?.tpaPageId
		const applicationId = linkObject.pageId?.tpaApplicationId
		const appData = appsClientSpecMapByApplicationId[applicationId!]
		if (appData && tpaPageId) {
			if (_.includes(tpaPageId, MULTI_SECTION_DELIMITER)) {
				tpaPageId = tpaPageId.substr(0, tpaPageId.indexOf(MULTI_SECTION_DELIMITER))
			}
			const section = _.find(appData.widgets, (widget) => widget.appPage?.id === tpaPageId)
			return section?.appPage.hideFromMenu
		}
	}
	return false
}

function getSitePagesFromMenuItems({ menuItems, mainPageId, baseUrl, linkUtils }: any): Array<SiteMapLink> {
	return _.map(menuItems, (item) => {
		const result = getEnhancedPageInfo(item, mainPageId, baseUrl, linkUtils)
		if (result.type === LINK_TYPES.PAGE_LINK || result.type === LINK_TYPES.MENU_HEADER) {
			const subPages = _.map(item.items, (subItem) =>
				getEnhancedPageInfo(subItem, mainPageId, baseUrl, linkUtils)
			)
			if (_.size(subPages) > 0) {
				_.assign(result, {
					subPages,
				})
			}
		}
		return result
	})
}

function getRelevantLinkDataFromMenuItem(menuItem: any): SiteMapLink {
	const link = _.pick(menuItem.link, LINK_PANEL_PROPS[menuItem.link.type])
	if (_.isObject(link.pageId)) {
		link.pageId = `#${_.get(link, 'pageId.id')}`
	}
	if (_.isObject(link.anchorDataId)) {
		link.anchorDataId = `#${_.get(link, 'anchorDataId.id')}`
	}
	return link
}

function getEnhancedPageInfo(menuItem: any, mainPageId: string, baseUrl: string, linkUtils: any): SiteMapLink {
	const title = menuItem.label || ''
	const hidden = !menuItem.isVisible || false
	const linkData = menuItem.link ? getRelevantLinkDataFromMenuItem(menuItem) : {}
	const link = _.merge(linkData, {
		title,
		hidden,
	})

	if (!link.type) {
		return {
			type: LINK_TYPES.MENU_HEADER,
			hidden,
			title,
			subPages: link.subPages,
		}
	}

	switch (link.type) {
		default:
		case LINK_TYPES.PAGE_LINK:
			_.merge(link, getExtraPageInfo(menuItem, mainPageId, baseUrl))
			break
		case LINK_TYPES.ANCHOR_LINK:
			_.merge(link, getExtraPageInfo(menuItem, mainPageId, baseUrl))
			break
		case LINK_TYPES.DOCUMENT_LINK:
			const linkUrl = linkUtils.getLinkUrlFromDataItem(link)
			const linkProps = linkUtils.getLinkProps(linkUrl)
			link.url = linkProps.href
			break
	}

	return link
}

function getExtraPageInfo(pageData: any, mainPageId: string, baseUrl: string) {
	const pageUriSEO = pageData.link?.pageId?.pageUriSEO
	const info = {
		isHomePage: pageData.link?.pageId?.id === mainPageId,
	}
	if (pageUriSEO) {
		_.assign(info, { url: baseUrl + '/' + pageUriSEO })
	}
	return info
}

export const GetSiteMapHandler = withDependencies(
	[
		ExperimentsSymbol,
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(MasterPageFeatureConfigSymbol, name),
		RoutingLinkUtilsAPISymbol,
		optional(PopupsLinkUtilsAPISymbol),
	],
	(
		experiments: Experiments,
		{
			externalBaseUrl,
			appsClientSpecMapByApplicationId,
			metaSiteId,
			isPremiumDomain,
			userFileDomainUrl,
			routersConfig,
		}: TpaCommonsSiteConfig,
		{ menuData, menuDataNew }: TpaMasterPageConfig,
		routingLinkUtilsAPI: IRoutingLinkUtilsAPI,
		popupsLinkUtilsAPI: IPopupsLinkUtilsAPI
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			function getSiteMap(): SiteMapResponse {
				const linkUtilsRoutingInfo = routingLinkUtilsAPI.getLinkUtilsRoutingInfo()
				const linkUtils = createLinkUtils({
					routingInfo: linkUtilsRoutingInfo,
					metaSiteId,
					userFileDomainUrl,
					isPremiumDomain,
					routersConfig,
					popupPages: popupsLinkUtilsAPI?.getPopupPages(),
				})

				const menuDataItem = experiments['specs.thunderbolt.getSiteMapRespectsMenuSets']
					? menuDataNew
					: menuData

				return getSitePagesFromMenuItems({
					menuItems: _.filter(
						menuDataItem.items,
						(item: any) => !isPageMarkedAsHideFromMenu(appsClientSpecMapByApplicationId, item.link)
					),
					mainPageId: linkUtilsRoutingInfo.mainPageId,
					baseUrl: externalBaseUrl,
					linkUtils,
				})
			}

			return {
				getSitePages(compId: string, { includePagesUrl }: { includePagesUrl: boolean }): SitePagesResponse {
					return getSiteMap().map((item) => ({
						hide: item.hidden,
						id: _.isString(item.pageId) && item.pageId.replace('#', ''),
						isHomepage: item.isHomePage || false,
						title: item.title,
						...(includePagesUrl && { url: item.url }),
					}))
				},
				getSiteMap(): SiteMapResponse {
					return getSiteMap()
				},
			}
		},
	})
)

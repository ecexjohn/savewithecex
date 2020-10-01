import _ from 'lodash'
import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	TpaHandlerProvider,
	PageFeatureConfigSymbol,
	MasterPageFeatureConfigSymbol,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { createLinkUtils } from '@wix/thunderbolt-commons'
import { TpaPageConfig, TpaMasterPageConfig } from '../types'
import { IRoutingLinkUtilsAPI, RoutingLinkUtilsAPISymbol } from 'feature-router'
import { IPopupsLinkUtilsAPI, PopupsLinkUtilsAPISymbol } from 'feature-popups'
import { name } from '../symbols'
import { DynamicPageLinkData } from '@wix/thunderbolt-becky-types'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type MessageData = { sectionId: string; state: string }
export type HandlerResponse =
	| { url: string }
	| {
			error: {
				message: string
			}
	  }

export const GetStateUrlHandler = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		RoutingLinkUtilsAPISymbol,
		optional(PopupsLinkUtilsAPISymbol),
	],
	(
		{
			metaSiteId,
			userFileDomainUrl,
			routersConfig,
			isPremiumDomain,
			appsClientSpecMapByApplicationId,
			externalBaseUrl,
		}: TpaCommonsSiteConfig,
		tpaPageConfig: TpaPageConfig,
		tpaMasterPageConfig: TpaMasterPageConfig,
		routingLinkUtilsAPI: IRoutingLinkUtilsAPI,
		popupsLinkUtilsAPI: IPopupsLinkUtilsAPI
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			const linkUtils = createLinkUtils({
				routingInfo: routingLinkUtilsAPI.getLinkUtilsRoutingInfo(),
				metaSiteId,
				userFileDomainUrl,
				isPremiumDomain,
				routersConfig,
				popupPages: popupsLinkUtilsAPI?.getPopupPages(),
			})
			const appIdToAppPagesIds = _(tpaMasterPageConfig.pagesData)
				.groupBy('tpaApplicationId')
				.mapValues((pages) => pages.map((page) => page.id))
				.value()
			const pagesDataEntries = Object.entries(tpaMasterPageConfig.pagesData)
			const sectionIdToPageId = pagesDataEntries
				.map(([pageId, pageData]) => ({ [pageData.tpaPageId]: pageId }))
				.reduce(_.assign)
			const getAppIdCompId = (id: string) => {
				return tpaPageConfig.widgets[id].applicationId
			}
			return {
				getStateUrl(compId, msgData: MessageData, { originCompId }): HandlerResponse {
					const { state, sectionId } = msgData
					const appId = getAppIdCompId(originCompId)
					const appData = appsClientSpecMapByApplicationId[appId]
					const appPages = appIdToAppPagesIds[appId]
					if (!appPages || appPages.length === 0) {
						return {
							error: {
								message: `Page with app "${appData.appDefinitionName}" was not found.`,
							},
						}
					}
					const sectionPageId = sectionIdToPageId[sectionId]
					const pageId = sectionPageId || appPages[0]
					const linkData: DynamicPageLinkData = {
						type: 'DynamicPageLink',
						routerId: pageId,
						isTpaRoute: true,
						innerRoute: state,
					}
					const linkUrl = linkUtils.getLinkUrlFromDataItem(linkData)
					if (linkUtils.isDynamicPage(linkUrl)) {
						return {
							error: {
								message:
									"Can't retrieve url for a dynamic page. Please use the platform app API instead.",
							},
						}
					}
					return { url: `${externalBaseUrl}${linkUrl}` }
				},
			}
		},
	})
)

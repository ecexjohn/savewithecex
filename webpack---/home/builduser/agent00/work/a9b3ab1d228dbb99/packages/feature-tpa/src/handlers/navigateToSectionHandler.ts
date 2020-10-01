import _ from 'lodash'
import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	TpaHandlerProvider,
	PageFeatureConfigSymbol,
	MasterPageFeatureConfigSymbol,
	SiteFeatureConfigSymbol,
	CurrentRouteInfoSymbol,
} from '@wix/thunderbolt-symbols'
import { createLinkUtils } from '@wix/thunderbolt-commons'

import { INavigation, NavigationSymbol } from 'feature-navigation'
import { TpaPageConfig, TpaMasterPageConfig } from '../types'

import { IRoutingLinkUtilsAPI, RoutingLinkUtilsAPISymbol } from 'feature-router'
import { IPopupsLinkUtilsAPI, PopupsLinkUtilsAPISymbol } from 'feature-popups'
import { name, TpaEventsListenerManagerSymbol } from '../symbols'
import { DynamicPageLinkData } from '@wix/thunderbolt-becky-types'
import { PageTransitionsSymbol, IPageTransition } from 'feature-page-transitions'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type MessageData = {
	sectionIdentifier?: {
		sectionId: string
		appDefinitionId?: string
		queryParams?: {
			[paramName: string]: string
		}
		state?: string
		noTransition?: boolean
	}
	state?: string
}

export const NavigateToSectionHandler = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		NavigationSymbol,
		RoutingLinkUtilsAPISymbol,
		optional(PopupsLinkUtilsAPISymbol),
		optional(PageTransitionsSymbol),
		CurrentRouteInfoSymbol,
		TpaEventsListenerManagerSymbol,
	],
	(
		{
			metaSiteId,
			userFileDomainUrl,
			routersConfig,
			isPremiumDomain,
			appsClientSpecMapData,
			appsClientSpecMapByApplicationId,
		}: TpaCommonsSiteConfig,
		tpaPageConfig: TpaPageConfig,
		tpaMasterPageConfig: TpaMasterPageConfig,
		navigation: INavigation,
		routingLinkUtilsAPI: IRoutingLinkUtilsAPI,
		popupsLinkUtilsAPI: IPopupsLinkUtilsAPI,
		pageTransition: IPageTransition
	): TpaHandlerProvider => {
		const pagesDataEntries = Object.entries(tpaMasterPageConfig.pagesData)
		const appIdToSectionIdToPageId = pagesDataEntries.reduce(
			(acc, [pageId, pageData]) => {
				if (!acc[pageData.tpaApplicationId]) {
					acc[pageData.tpaApplicationId] = {}
				}

				acc[pageData.tpaApplicationId][pageData.tpaPageId] = pageId

				return acc
			},
			{} as {
				[appId: string]: {
					[sectionId: string]: string
				}
			}
		)

		const appIdToAppPagesIds = _(tpaMasterPageConfig.pagesData)
			.groupBy('tpaApplicationId')
			.mapValues((pages) => pages.map((page) => page.id))
			.value()

		return {
			getTpaHandlers() {
				return {
					async navigateToSectionPage(compId: string, msgData: MessageData, { originCompId }) {
						const linkUtils = createLinkUtils({
							routingInfo: routingLinkUtilsAPI.getLinkUtilsRoutingInfo(),
							metaSiteId,
							userFileDomainUrl,
							isPremiumDomain,
							routersConfig,
							popupPages: popupsLinkUtilsAPI?.getPopupPages(),
						})

						const {
							sectionIdentifier: {
								sectionId,
								noTransition = false,
								appDefinitionId,
								queryParams = {},
								state: stateFromSectionIdentifier,
							} = {},
							state: stateFromRoot,
						} = msgData

						const state = stateFromRoot || stateFromSectionIdentifier

						const getAppIdCompId = (id: string) => {
							return tpaPageConfig.widgets[id].applicationId
						}

						const getAppIdFromAppDefId = (appDefId: string) => {
							return appsClientSpecMapData[appDefId].applicationId
						}

						const appId = appDefinitionId
							? getAppIdFromAppDefId(appDefinitionId)
							: getAppIdCompId(originCompId)
						const appData = appsClientSpecMapByApplicationId[appId]

						if (!appData) {
							if (!appDefinitionId) {
								return {
									error: {
										message: `Application with appDefinitionId "${appDefinitionId}" was not found on the site.`,
									},
								}
							}

							return { error: { message: 'Component was not found.' } }
						}

						const nextAppPages = appIdToAppPagesIds[appId]
						if (!nextAppPages || nextAppPages.length === 0) {
							return {
								error: {
									message: `Page with app "${appData.appDefinitionName}" was not found.`,
								},
							}
						}

						const sectionPageId = sectionId ? appIdToSectionIdToPageId[appId][sectionId] : null

						if (sectionId && !sectionPageId) {
							return {
								error: {
									message: `App page with sectionId "${sectionId}" was not found.`,
								},
							}
						}
						const nextPageId = sectionPageId || nextAppPages[0]

						const linkData: DynamicPageLinkData = {
							type: 'DynamicPageLink',
							routerId: nextPageId,
							innerRoute: state,
							isTpaRoute: true,
						}

						const linkUrl = linkUtils.getLinkUrlFromDataItem(linkData)
						if (linkUtils.isDynamicPage(linkUrl)) {
							return {
								error: {
									message:
										"Can't navigate to a dynamic page. Please use the platform app API instead.",
								},
							}
						}

						const queryParamsUrl = _.isEmpty(queryParams)
							? ''
							: `?appSectionParams=${encodeURIComponent(JSON.stringify(queryParams))}`
						const url = `${linkUrl}${queryParamsUrl}`

						const linkProps = linkUtils.getLinkProps(url)

						if (noTransition && pageTransition) {
							pageTransition.disableNextTransition()
						}

						return navigation.navigateTo(linkProps)
					},
				}
			},
		}
	}
)

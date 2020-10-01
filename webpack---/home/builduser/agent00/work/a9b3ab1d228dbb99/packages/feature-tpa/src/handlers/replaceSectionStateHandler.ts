import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	TpaHandlerProvider,
	CurrentRouteInfoSymbol,
	PageFeatureConfigSymbol,
	Props,
	IPropsStore,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { NavigationSymbol, INavigation } from 'feature-navigation'
import { ICurrentRouteInfo, IRoutingLinkUtilsAPI, RoutingLinkUtilsAPISymbol } from 'feature-router'
import _ from 'lodash'
import { createLinkUtils, isLinkProps } from '@wix/thunderbolt-commons'
import { IPopupsLinkUtilsAPI, PopupsLinkUtilsAPISymbol } from 'feature-popups'
import { name, TpaEventsListenerManagerSymbol } from '../symbols'
import { ITPAEventsListenerManager, TpaPageConfig } from '../types'
import { DynamicPageLinkData, PageLinkData } from '@wix/thunderbolt-becky-types'
import { ImageZoomAPISymbol, ImageZoomAPI } from 'feature-image-zoom'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type ReplaceSectionStateMessage = { state: string; queryParams?: Record<string, string> }
export type AppStateChangedMessage = { state: string }

export const ReplaceSectionStateHandler = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, name),
		CurrentRouteInfoSymbol,
		Props,
		NavigationSymbol,
		TpaEventsListenerManagerSymbol,
		RoutingLinkUtilsAPISymbol,
		optional(PopupsLinkUtilsAPISymbol),
		optional(ImageZoomAPISymbol),
	],
	(
		{ metaSiteId, userFileDomainUrl, routersConfig, isPremiumDomain }: TpaCommonsSiteConfig,
		tpaPageConfig: TpaPageConfig,
		currentRouteInfo: ICurrentRouteInfo,
		propsStore: IPropsStore,
		navigation: INavigation,
		tpaEventsListenerManager: ITPAEventsListenerManager,
		routingLinkUtilsAPI: IRoutingLinkUtilsAPI,
		popupsLinkUtilsAPI: IPopupsLinkUtilsAPI,
		zoomAPI: ImageZoomAPI
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			const routingInfo = routingLinkUtilsAPI.getLinkUtilsRoutingInfo()
			const linkUtils = createLinkUtils({
				routingInfo,
				metaSiteId,
				isPremiumDomain,
				userFileDomainUrl,
				routersConfig,
				popupPages: popupsLinkUtilsAPI?.getPopupPages(),
			})

			const replaceState = async ({
				compId,
				state,
				skipHistory,
				queryParams = {},
			}: {
				compId: string
				state: string
				skipHistory: boolean
				queryParams?: Record<string, string>
			}) => {
				const { widgets } = tpaPageConfig
				const isTpaSection = widgets[compId]?.isSection
				if (!isTpaSection) {
					return
				}

				// current page link data
				const linkData: DynamicPageLinkData = {
					type: 'DynamicPageLink',
					routerId: routingInfo.pageId,
					innerRoute: state,
					isTpaRoute: true,
				}
				const linkUrl = linkUtils.getLinkUrlFromDataItem(linkData)

				const queryParamsUrl = _.isEmpty(queryParams)
					? ''
					: `?appSectionParams=${encodeURIComponent(JSON.stringify(queryParams))}`
				const url = `${linkUrl}${queryParamsUrl}`

				const linkProps = linkUtils.getLinkProps(url)
				return navigation.navigateTo(linkProps, { skipHistory })
			}

			return {
				async replaceSectionState(_compId, { state, queryParams }: ReplaceSectionStateMessage): Promise<void> {
					replaceState({ compId: _compId, skipHistory: true, state, queryParams })
				},
				async appStateChanged(_compId, { state }: AppStateChangedMessage): Promise<void> {
					// state can either be a string or a stringified cmd/args JSON such as "{"cmd":"zoom","args":[0]}"
					// used in TPA galleries
					let parsedState: { cmd: string; args?: Array<any> } | null
					try {
						parsedState = JSON.parse(state)
					} catch (e) {
						// state is not a JSON string
						parsedState = null
					}

					// state is a stringified cmd/args JSON
					if (parsedState) {
						const tpaGalleryStateCommandToAction: Record<string, () => void> = {
							zoom: () => {
								const [itemIndex] = parsedState!.args
								const { id } = propsStore.get(_compId).images[itemIndex]
								zoomAPI.openImageZoom(_compId, id)
							},
							itemClicked: () => {
								const [itemIndex] = parsedState!.args
								const onItemClicked = propsStore.get(_compId).onItemClicked
								onItemClicked &&
									onItemClicked({
										type: 'itemClicked',
										itemIndex,
										item: propsStore.get(_compId).images[itemIndex],
									})
							},
							itemChanged: () => {
								const [itemIndex] = parsedState!.args
								const onCurrentItemChanged = propsStore.get(_compId).onCurrentItemChanged
								onCurrentItemChanged &&
									onCurrentItemChanged({
										type: 'imageChanged',
										itemIndex,
										item: propsStore.get(_compId).images[itemIndex],
									})
							},
							componentReady: () => {
								propsStore.update({
									[_compId]: {
										componentReady: true,
									},
								})
							},
							navigateToDynamicPage: () => {
								const [dynamicPageLinkData] = parsedState!.args
								const linkProps = isLinkProps(dynamicPageLinkData)
									? dynamicPageLinkData
									: linkUtils.getLinkProps(linkUtils.getLinkUrlFromDataItem(dynamicPageLinkData))
								navigation.navigateTo(linkProps)
							},
							navigateToAnchor: () => {
								const [pageId, anchorDataId] = parsedState!.args
								const actualPageId =
									pageId === 'masterPage'
										? routingLinkUtilsAPI.getLinkUtilsRoutingInfo().pageId
										: pageId
								const linkData: PageLinkData = {
									type: 'PageLink',
									pageId: actualPageId,
									target: '_self',
								}
								const pageUrl = linkUtils.getLinkUrlFromDataItem(linkData)
								const linkProps = linkUtils.getLinkProps(pageUrl)
								const anchorLinkProps = Object.assign(linkProps, anchorDataId)
								navigation.navigateTo(anchorLinkProps)
							},
						}

						const commandAction = tpaGalleryStateCommandToAction[parsedState.cmd]
						if (commandAction) {
							commandAction()
						}
						return
					}

					// state is a regular string, need to invoke same logic as replaceSectionState handler
					// but when changing the url we should add it to browser history
					replaceState({ compId: _compId, skipHistory: false, state })
				},
			}
		},
	})
)

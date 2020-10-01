import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BusinessLogger,
	BusinessLoggerSymbol,
	IPageWillMountHandler,
	IPageWillUnmountHandler,
	IPropsStore,
	PageFeatureConfigSymbol,
	pageIdSym,
	contextIdSymbol,
	Props,
	SiteFeatureConfigSymbol,
	WixBiSession,
	WixBiSessionSymbol,
	CurrentRouteInfoSymbol,
} from '@wix/thunderbolt-symbols'
import { ITpa, TpaPageConfig } from './types'
import { name } from './symbols'
import {
	name as tpaCommonsName,
	MasterPageTpaPropsCacheSymbol,
	MasterPageTpaPropsCache,
	TpaCommonsSiteConfig,
	TpaCompData,
	ITpaSrcBuilder,
	TpaSrcBuilderSymbol,
	TpaContextMappingSymbol,
	ITpaContextMapping,
	BuildTpaSrcOptions,
} from 'feature-tpa-commons'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import _ from 'lodash'
import * as ResponsiveChatUtils from './utils/responsiveChatUtils'
import { ICurrentRouteInfo } from 'feature-router'

export const Tpa = withDependencies(
	[
		Props,
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, name),
		SessionManagerSymbol,
		BusinessLoggerSymbol,
		pageIdSym,
		contextIdSymbol,
		MasterPageTpaPropsCacheSymbol,
		TpaSrcBuilderSymbol,
		TpaContextMappingSymbol,
		WixBiSessionSymbol,
		CurrentRouteInfoSymbol,
	],
	(
		props: IPropsStore,
		{ widgetsClientSpecMapData, isMobileView, viewMode, externalBaseUrl }: TpaCommonsSiteConfig,
		{ widgets, tpaInnerRouteConfig }: TpaPageConfig,
		sessionManager: ISessionManager,
		businessLogger: BusinessLogger,
		pageId: string,
		contextId: string,
		{ cacheProps, getCachedProps }: MasterPageTpaPropsCache,
		tpaSrcBuilder: ITpaSrcBuilder,
		tpaContextMapping: ITpaContextMapping,
		wixBiSession: WixBiSession,
		currentRouteInfo: ICurrentRouteInfo
	): IPageWillMountHandler & IPageWillUnmountHandler & ITpa => {
		const tpaWidgetsToRegister = Object.entries(widgets)
			// Register ResponsiveChat under its template id, and not the viewer id
			.map(([id, tpaCompData]) => {
				const uniqueOrTemplateId = ResponsiveChatUtils.getTemplateOrUniqueId(id, tpaCompData)
				if (id !== uniqueOrTemplateId) {
					tpaContextMapping.registerTpaTemplateId(uniqueOrTemplateId, id)
				}
				return uniqueOrTemplateId
			})

		tpaContextMapping.registerTpasForContext(contextId, tpaWidgetsToRegister)
		const tpas = _.pickBy(widgets, ({ widgetId, isOOI }) => !isOOI && widgetsClientSpecMapData[widgetId])

		const getCompId = (id: string, { templateId }: TpaCompData) => templateId ?? id

		const buildSrc = (id: string, tpaCompData: TpaCompData) => {
			const { widgetUrl, mobileUrl } = widgetsClientSpecMapData[tpaCompData.widgetId]
			const baseUrl = isMobileView ? mobileUrl || widgetUrl : widgetUrl

			// If the component is a responsive chat - change the page id to masterPage, to be consistent on every navigation
			const overridePageId = ResponsiveChatUtils.isResponsiveChat(tpaCompData) ? 'masterPage' : pageId

			const options: Partial<BuildTpaSrcOptions> = { extraQueryParams: {} }
			if (tpaCompData.isSection) {
				options.tpaInnerRouteConfig = tpaInnerRouteConfig
				if (viewMode === 'site') {
					options.extraQueryParams!['section-url'] = `${externalBaseUrl}/${tpaInnerRouteConfig.tpaPageUri}/`
					options.extraQueryParams!.target = '_top'
				} else {
					options.extraQueryParams!['section-url'] = baseUrl
					options.extraQueryParams!.target = '_self'
				}
			}
			return tpaSrcBuilder.buildSrc(id, overridePageId, tpaCompData, baseUrl, options)
		}

		const rebuildTpasSrc = () => {
			Object.entries(tpas).forEach(([id, tpaCompData]) => {
				props.update({
					[id]: {
						src: buildSrc(id, tpaCompData),
					},
				})
			})
		}

		return {
			async pageWillMount() {
				sessionManager.addLoadNewSessionCallback(({ reason }) => {
					if (reason === 'memberLogin') {
						rebuildTpasSrc()
					}
				})
				Object.entries(tpas).forEach(([id, tpaCompData]) => {
					const { widgetId } = tpaCompData
					const { appDefinitionId, appDefinitionName, appPage, allowScrolling } = widgetsClientSpecMapData[
						widgetId
					]
					const reportIframeStartedLoading = _.once(() => {
						const routeInfo = currentRouteInfo.getCurrentRouteInfo()

						const now = Date.now()
						const tts = now - wixBiSession.initialRequestTimestamp
						businessLogger.logger.log(
							{
								appId: appDefinitionId,
								widget_id: widgetId,
								instance_id: getCompId(id, tpaCompData),
								src: 42,
								// APP_IFRAME_START_LOADING
								evid: 642,
								tts,
								pid: routeInfo ? routeInfo.pageId : null,
							},
							{ endpoint: 'ugc-viewer' }
						)
					})

					const defaultProps = {
						title: appPage.name ?? appDefinitionName,
						appDefinitionName,
						isMobileView,
						allowScrolling,
						reportIframeStartedLoading,
					}

					// Get cached props by template/uniqueId depending on if the comp is a responsive chat
					const templateOrUniqueId = ResponsiveChatUtils.getTemplateOrUniqueId(id, tpaCompData)

					const cachedProps = getCachedProps(templateOrUniqueId)
					const src = buildSrc(templateOrUniqueId, tpaCompData)

					props.update({
						[id]: {
							...defaultProps,
							src,
							...(cachedProps as any),
						},
					})
				})
			},
			pageWillUnmount() {
				if (pageId === 'masterPage') {
					Object.entries(tpas).forEach(([id]) => cacheProps(id))
				} else {
					// For chat to persist between navigations when isResponsive is true - we are caching its props
					// Even if its not in the master page
					Object.entries(tpas)
						.filter(([_id, tpaCompData]) => ResponsiveChatUtils.isResponsiveChat(tpaCompData))
						.forEach(([id, tpaCompData]) =>
							// Cache the already given props, by the viewer id, and save them under the template
							cacheProps(ResponsiveChatUtils.getTemplateOrUniqueId(id, tpaCompData), props.get(id))
						)
				}
			},
			rebuildTpasSrc,
		}
	}
)

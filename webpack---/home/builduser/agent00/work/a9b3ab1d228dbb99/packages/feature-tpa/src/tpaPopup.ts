import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	ITpaPopup,
	TpaFeatureState,
	TpaMasterPageConfig,
	TpaPageConfig,
	TpaPopupProps,
	TpaPopupRegistry,
} from './types'
import {
	BrowserWindowSymbol,
	contextIdSymbol,
	FeatureStateSymbol,
	IPageDidMountHandler,
	IPageDidUnmountHandler,
	IPropsStore,
	IStructureAPI,
	MasterPageFeatureConfigSymbol,
	PageFeatureConfigSymbol,
	pageIdSym,
	Props,
	SiteFeatureConfigSymbol,
	StructureAPI,
} from '@wix/thunderbolt-symbols'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import { name } from './symbols'
import { computeStyleOverrides, isFullScreen } from './utils/tpaStyleOverridesBuilder'
import { isSSR, runtimeTpaCompIdBuilder } from '@wix/thunderbolt-commons'
import { IFeatureState } from 'thunderbolt-feature-state'
import _ from 'lodash'
import { ISiteScrollBlocker, SiteScrollBlockerSymbol } from 'feature-site-scroll-blocker'
import {
	name as tpaCommonsName,
	TpaCommonsSiteConfig,
	ITpaSrcBuilder,
	TpaSrcBuilderSymbol,
	ITpaContextMapping,
	TpaContextMappingSymbol,
} from 'feature-tpa-commons'

export const TPA_POPUP_COMP_ID_PREFIX = 'tpapopup'

export const TpaPopupFactory = withDependencies(
	[
		Props,
		StructureAPI,
		named(FeatureStateSymbol, name),
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(MasterPageFeatureConfigSymbol, name),
		named(PageFeatureConfigSymbol, name),
		SessionManagerSymbol,
		BrowserWindowSymbol,
		SiteScrollBlockerSymbol,
		pageIdSym,
		contextIdSymbol,
		TpaSrcBuilderSymbol,
		TpaContextMappingSymbol,
	],
	(
		props: IPropsStore,
		structureAPI: IStructureAPI,
		featureState: IFeatureState<TpaFeatureState>,
		{ isMobileView }: TpaCommonsSiteConfig,
		{ masterPageTpaComps }: TpaMasterPageConfig,
		{ widgets }: TpaPageConfig,
		sessionManager: ISessionManager,
		window: Window,
		siteScrollBlocker: ISiteScrollBlocker,
		pageId: string,
		contextId: string,
		tpaSrcBuilder: ITpaSrcBuilder,
		tpaContextMapping: ITpaContextMapping
	): ITpaPopup & IPageDidMountHandler & IPageDidUnmountHandler => {
		const updateOpenedPopups = (openedPopups: TpaPopupRegistry) => {
			featureState.update((currentState) => ({ ...currentState, tpaPopup: { openedPopups } }))
		}

		const getOpenedPopups = (): TpaPopupRegistry => _.get(featureState.get(), ['tpaPopup', 'openedPopups'], {})

		let pageDidMountResolver: () => void
		const pageDidMountPromise = new Promise((resolve) => {
			// prevent divergence when platform is so fast it updates the state before hydration
			pageDidMountResolver = resolve
		})

		const popupCompIdRegex = new RegExp(
			runtimeTpaCompIdBuilder.buildRuntimeCompId(`${TPA_POPUP_COMP_ID_PREFIX}-[0-9]+`, '.+')
		)

		return {
			pageDidMount() {
				pageDidMountResolver()
				sessionManager.addLoadNewSessionCallback(() =>
					Object.values(getOpenedPopups()).forEach(({ refreshPopUp }) => refreshPopUp())
				)
			},
			pageDidUnmount() {
				Object.values(getOpenedPopups()).forEach(({ isPersistent, closePopup }) => {
					if (!isPersistent) {
						closePopup()
					}
				})
			},
			isPopup(compId) {
				return popupCompIdRegex.test(compId)
			},
			openPopup(url, options, compId) {
				return new Promise(async (resolve) => {
					if (isSSR(window)) {
						// do not open popups in ssr even if requested from an OOI/wixCode
						return
					}
					await pageDidMountPromise
					const popupCompId = runtimeTpaCompIdBuilder.buildRuntimeCompId(
						`${TPA_POPUP_COMP_ID_PREFIX}-${Date.now()}`,
						compId
					)
					// in cases where openPopup is triggered with compId belonging to another container, use the container of the compId instead of the current
					const originContextId = compId ? structureAPI.getContextIdOfCompId(compId) || contextId : contextId
					tpaContextMapping.registerTpasForContext(originContextId, [popupCompId])
					const closePopup = (data: any) => {
						const openedPopups = getOpenedPopups()
						delete openedPopups[popupCompId]
						updateOpenedPopups(openedPopups)
						structureAPI.removeComponentFromDynamicStructure(popupCompId)
						siteScrollBlocker.setSiteScrollingBlocked(false, popupCompId)
						resolve(data)
					}

					const styleOverrides = computeStyleOverrides(options, window, compId)
					const buildSrc = () => {
						const originTpaCompData = widgets[compId] || masterPageTpaComps[compId]
						return tpaSrcBuilder.buildSrc(popupCompId, pageId, originTpaCompData, url, {
							extraQueryParams: { origCompId: compId },
						})
					}

					const refreshPopUp = () => {
						props.update({
							[popupCompId]: { src: buildSrc() },
						})
					}

					const tpaProps: TpaPopupProps = {
						// put the original options and compId if we ever need to recalculate style later
						options,
						originCompId: compId,
						src: buildSrc(),
						styleOverrides,
						isBareTheme: options.theme === 'BARE',
						closePopup,
					}

					props.update({
						[popupCompId]: tpaProps,
					})

					await structureAPI.addComponentToDynamicStructure(popupCompId, {
						components: [],
						componentType: 'TPAPopup',
					})

					const openedPopups = getOpenedPopups()
					updateOpenedPopups({
						...openedPopups,
						[popupCompId]: {
							isPersistent: options.persistent,
							closePopup,
							refreshPopUp,
						},
					})
					siteScrollBlocker.setSiteScrollingBlocked(
						isMobileView && isFullScreen(styleOverrides, window),
						popupCompId
					)
				})
			},
			closePopup(compId, onCloseMessage) {
				if (compId in getOpenedPopups()) {
					getOpenedPopups()[compId].closePopup(onCloseMessage)
				}
			},
			getOpenedPopups,
		}
	}
)

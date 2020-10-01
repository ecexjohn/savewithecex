import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	IPropsStore,
	Props,
	PageFeatureConfigSymbol,
	IStructureAPI,
	StructureAPI,
	pageIdSym,
	IPageDidMountHandler,
	FeatureStateSymbol,
	SiteFeatureConfigSymbol,
	contextIdSymbol,
	MasterPageFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { ITpaModal, OpenModalOptions, TpaFeatureState, TpaMasterPageConfig, TpaPageConfig } from './types'
import { enableCyclicTabbing, disableCyclicTabbing, isSSR, runtimeTpaCompIdBuilder } from '@wix/thunderbolt-commons'
import { ISiteScrollBlocker, SiteScrollBlockerSymbol } from 'feature-site-scroll-blocker'
import { name } from './symbols'
import { hideSiteRoot } from './utils/tpaFullScreenUtils'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'
import { IFeatureState } from 'thunderbolt-feature-state'
import _ from 'lodash'
import {
	ITpaContextMapping,
	ITpaSrcBuilder,
	name as tpaCommonsName,
	TpaCommonsSiteConfig,
	TpaContextMappingSymbol,
	TpaSrcBuilderSymbol,
} from 'feature-tpa-commons'

const MIN_MARGIN = 50
export const TPA_MODAL_COMP_ID_PREFIX = 'tpaModal'

const modalFactory = (
	{ tpaModalConfig, isMobileView }: TpaCommonsSiteConfig,
	{ masterPageTpaComps }: TpaMasterPageConfig,
	{ widgets }: TpaPageConfig,
	featureState: IFeatureState<TpaFeatureState>,
	props: IPropsStore,
	window: BrowserWindow,
	siteScrollBlocker: ISiteScrollBlocker,
	structureAPI: IStructureAPI,
	sessionManager: ISessionManager,
	pageId: string,
	contextId: string,
	commonConfigAPI: ICommonConfig,
	tpaSrcBuilder: ITpaSrcBuilder,
	tpaContextMapping: ITpaContextMapping
): ITpaModal & IPageDidMountHandler => {
	const { isPreviewMode, wixTPAs } = tpaModalConfig

	let unregisterEscapePress = () => {}

	const setCloseModalImpl = (closeModalImpl: (msg: any) => void) => {
		featureState.update((currentState) => ({
			...currentState,
			tpaModal: {
				closeModalImpl,
			},
		}))
	}

	const getCloseModalImpl = (): ((msg?: any) => void) =>
		_.get(featureState.get(), ['tpaModal', 'closeModalImpl'], () => {})

	const calculateModalSize = (
		width: number,
		height: number,
		isAppWixTPA: boolean
	): { width: number; height: number } => {
		const windowSize = {
			width: window!.innerWidth,
			height: window!.innerHeight,
		}

		width = Math.min(width, windowSize.width)
		height = Math.min(height, windowSize.height)

		if (!isAppWixTPA) {
			const minWidth = windowSize.width - MIN_MARGIN
			const minHeight = windowSize.height - MIN_MARGIN

			if (width >= minWidth && height >= minHeight) {
				width = minWidth
				height = minHeight
			}
		}

		return { width, height }
	}

	const listenToEscapeKeyPress = (cb: () => void) => {
		if (isSSR(window)) {
			return () => {}
		}
		const onKeyDown = (e: Event) => {
			const keyboardEvent = e as KeyboardEvent
			if (keyboardEvent.key === 'Escape') {
				cb()
			}
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}

	let pageDidMountResolver: () => void
	const pageDidMountPromise = new Promise((resolve) => {
		// prevent divergence when platform is so fast it updates the state before hydration
		pageDidMountResolver = resolve
	})

	return {
		pageDidMount() {
			pageDidMountResolver()
		},
		isModal(compId) {
			return compId.startsWith(TPA_MODAL_COMP_ID_PREFIX)
		},
		openModal(url: string, { width, height, title, theme }: OpenModalOptions, compId?: string): Promise<void> {
			if (isSSR(window)) {
				// prevent opening tpaModal in SSR
				return new Promise(() => {})
			}

			const modalCompId = runtimeTpaCompIdBuilder.buildRuntimeCompId(TPA_MODAL_COMP_ID_PREFIX, compId || pageId)
			// in cases where openPopup is triggered with compId belonging to another container, use the container of the compId instead of the current
			const originContextId = compId ? structureAPI.getContextIdOfCompId(compId) || contextId : contextId
			tpaContextMapping.registerTpasForContext(originContextId, [modalCompId])

			// close any open modals before opening another tpaModal
			getCloseModalImpl()()
			disableCyclicTabbing()

			const callerCompProps = compId ? props.get(compId) : null
			const applicationId = callerCompProps ? callerCompProps.applicationId : null
			const isAppWixTPA = wixTPAs[applicationId]

			const onWindowResize = () => {
				const dialogSize = calculateModalSize(width, height, isAppWixTPA)

				props.update({
					[modalCompId]: {
						width: dialogSize.width,
						height: dialogSize.height,
					},
				})
			}

			window.addEventListener('resize', onWindowResize)

			if (isMobileView) {
				/*
				 TODO revisit this solution if scrolling is still an issue in 2020
				  https://jira.wixpress.com/browse/WEED-15023
				  https://github.com/wix-private/santa/blob/be35a223fd3107e8addd3692a0f8a991a761c2b2/packages/core/src/main/components/siteAspects/siteScrollingBlockerAspect.js#L73
				 */
				siteScrollBlocker.setSiteScrollingBlocked(true, modalCompId)
			}
			return new Promise(async (resolve) => {
				await pageDidMountPromise

				setCloseModalImpl((msg) => {
					setCloseModalImpl(() => {})
					window.removeEventListener('resize', onWindowResize)
					enableCyclicTabbing()
					unregisterEscapePress()
					if (isMobileView) {
						siteScrollBlocker.setSiteScrollingBlocked(false, modalCompId)
						hideSiteRoot(window, false)
					}
					structureAPI.removeComponentFromDynamicStructure(modalCompId)
					props.update({
						[modalCompId]: {
							src: null,
							closeModal: () => {},
						},
					})
					resolve(msg)
				})

				unregisterEscapePress = listenToEscapeKeyPress(getCloseModalImpl())
				if (isMobileView && theme === 'LIGHT_BOX') {
					hideSiteRoot(window, true)
				}

				const modalSize = calculateModalSize(width, height, isAppWixTPA)

				const originTpaCompData: any = compId ? widgets[compId] || masterPageTpaComps[compId] || {} : {}
				const src = tpaSrcBuilder.buildSrc(modalCompId, pageId, originTpaCompData, url, {
					extraQueryParams: { isInModal: true, origCompId: compId },
				})

				props.update({
					[modalCompId]: {
						src,
						width: modalSize.width,
						height: modalSize.height,
						closeModal: getCloseModalImpl(),
						isMobileView,
						isPreviewMode,
						title,
						theme,
					},
				})
				await structureAPI.addComponentToDynamicStructure(modalCompId, {
					components: [],
					componentType: 'TPAModal',
				})
			})
		},
		closeModal(msg) {
			getCloseModalImpl()(msg)
		},
	}
}

export const TpaModal = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(MasterPageFeatureConfigSymbol, name),
		named(PageFeatureConfigSymbol, name),
		named(FeatureStateSymbol, name),
		Props,
		BrowserWindowSymbol,
		SiteScrollBlockerSymbol,
		StructureAPI,
		SessionManagerSymbol,
		pageIdSym,
		contextIdSymbol,
		CommonConfigSymbol,
		TpaSrcBuilderSymbol,
		TpaContextMappingSymbol,
	],
	modalFactory
)

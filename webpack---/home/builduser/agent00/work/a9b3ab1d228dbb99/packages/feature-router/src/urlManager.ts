import { withDependencies, multi, named } from '@wix/thunderbolt-ioc'
import { name, PopHistoryStateHandler, UrlChangeHandlerForPage } from './symbols'
import {
	IAppWillMountHandler,
	CurrentRouteInfoSymbol,
	BrowserWindowSymbol,
	BrowserWindow,
	ViewerModelSym,
	ViewerModel,
	SamePageUrlChangeListenerSymbol,
	ISamePageUrlChangeListener,
	IAppWillLoadPageHandler,
	MasterPageFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { IPageProvider, PageProviderSymbol } from 'feature-pages'
import {
	IUrlHistoryPopStateHandler,
	IUrlHistoryManager,
	IUrlChangeHandler,
	ICurrentRouteInfo,
	IUrlHistoryState,
	RouterMasterPageConfig,
} from './types'
import { getRelativeUrl } from './resolveUrl'

export const UrlChangeListener = withDependencies(
	[PageProviderSymbol, CurrentRouteInfoSymbol],
	(pageProvider: IPageProvider, currentRouteInfo: ICurrentRouteInfo): ISamePageUrlChangeListener => {
		return {
			onUrlChange: async (url) => {
				const routeInfo = currentRouteInfo.getCurrentRouteInfo()
				if (routeInfo) {
					currentRouteInfo.updateRouteInfoUrl(url)
					const { contextId, pageId } = routeInfo
					const page = await pageProvider(contextId, pageId)
					const pageHandlers = page.getAllImplementersOf<IUrlChangeHandler>(UrlChangeHandlerForPage)
					return Promise.all(pageHandlers.map((handler) => handler.onUrlChange(url)))
				}
			},
		}
	}
)

export const UrlHistoryManager = withDependencies(
	[
		named(MasterPageFeatureConfigSymbol, name),
		BrowserWindowSymbol,
		ViewerModelSym,
		SamePageUrlChangeListenerSymbol,
		CurrentRouteInfoSymbol,
	],
	(
		{ popupPages }: RouterMasterPageConfig,
		browserWindow: BrowserWindow,
		viewerModel: ViewerModel,
		samePageUrlChangeListener: ISamePageUrlChangeListener,
		currentRouteInfo: ICurrentRouteInfo
	): IAppWillLoadPageHandler & IUrlHistoryManager => {
		const state: { previousPageId?: string } = {}
		const getCurrentUrl = (): string => browserWindow?.location.href || viewerModel.requestUrl

		return {
			async appWillLoadPage({ pageId }) {
				// Popups are triggering appWillLoadPage without updating the currentRouteInfo, so we ignore it for
				// deciding whether to samePageUrlChangeListener.onUrlChange() (Otherwise we loose the same page
				// context after a popup is opened).
				if (popupPages[pageId]) {
					return
				}

				// Keeping track of previous page ID so we know when url is changed within the same page (Assuming
				// pushUrlState happens after this appWillLoadPage).
				state.previousPageId = pageId
			},

			pushUrlState: (parsedUrl: URL, skipHistory?: boolean) => {
				if (!browserWindow || !browserWindow.history) {
					return
				}
				const url = parsedUrl.toString()

				const currentUrl = new URL(browserWindow.location.href)
				parsedUrl.searchParams.sort()
				currentUrl.searchParams.sort()

				const historyState: IUrlHistoryState = { scrollY: browserWindow.scrollY }
				if (skipHistory) {
					browserWindow.history.replaceState(historyState, '', url)
				}

				if (currentUrl.toString() === parsedUrl.toString()) {
					return
				}

				if (!skipHistory) {
					browserWindow.history.replaceState(historyState, '', currentUrl.toString())
					browserWindow.history.pushState(null, '', url)
				}

				const currentPageId = currentRouteInfo.getCurrentRouteInfo()?.pageId

				if (state.previousPageId === currentPageId) {
					samePageUrlChangeListener.onUrlChange(new URL(url))
				}
			},
			getHistoryState: () => {
				if (!browserWindow || !browserWindow.history) {
					return null
				}
				return browserWindow.history.state as IUrlHistoryState
			},

			updateHistoryState: (newHistory?: IUrlHistoryState, scrollRestoration?: ScrollRestoration) => {
				if (!browserWindow || !browserWindow.history) {
					return
				}
				if (scrollRestoration) {
					browserWindow.history.scrollRestoration = scrollRestoration
				}

				if (newHistory) {
					const currentUrl = new URL(browserWindow.location.href)
					currentUrl.searchParams.sort()

					browserWindow.history.replaceState(newHistory, '', currentUrl.toString())
				}

				return
			},

			getParsedUrl: () => new URL(getCurrentUrl()),

			getRelativeUrl: () => getRelativeUrl(getCurrentUrl(), viewerModel.site.externalBaseUrl),
		}
	}
)

export const PopStateListener = withDependencies(
	[multi(PopHistoryStateHandler), BrowserWindowSymbol, SamePageUrlChangeListenerSymbol, CurrentRouteInfoSymbol],
	(
		popStateHandlers: Array<IUrlHistoryPopStateHandler>,
		browserWindow: BrowserWindow,
		samePageUrlChangeListener: ISamePageUrlChangeListener,
		currentRouteInfo: ICurrentRouteInfo
	): IAppWillMountHandler => ({
		appWillMount: () => {
			if (!browserWindow) {
				return
			}
			browserWindow.addEventListener('popstate', async () => {
				const href = browserWindow.location.href
				await Promise.all(popStateHandlers.map((handler) => handler.onPopState(new URL(href))))

				const pageIdBeforeHandlingPopState = currentRouteInfo.getPreviousRouterInfo()?.pageId
				const pageIdAfterHandlingPopState = currentRouteInfo.getCurrentRouteInfo()?.pageId
				// when the first url change is due to a navigation to a tpa section, and the back button is hit, there's no prev route info
				if (!pageIdBeforeHandlingPopState || pageIdBeforeHandlingPopState === pageIdAfterHandlingPopState) {
					samePageUrlChangeListener.onUrlChange(new URL(href))
				}
			})
		},
	})
)

import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, TpaHandlerProviderSymbol, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { TpaHandlersManager } from './tpaHandlersManager'
import { TpaBroadcastManager } from './tpaBroadcastManager'
import {
	TpaModalSymbol,
	TpaEventsListenerManagerSymbol,
	TpaPopupSymbol,
	TpaFullScreenModeSymbol,
	TpaSymbol,
} from './symbols'
import { handlers } from './handlers'
import { TpaEventsListenerManager } from './eventsListenerManager'
import { TpaPopupFactory } from './tpaPopup'
import { publicApiTPAHandler } from './publicApiTPAHandler'
import { TpaModal } from './tpaModal'
import { SiteScrollDispatcher } from './siteScrollDispatch'
import { TpaFullScreenMode } from './tpaFullScreenMode'
import { tpaCommonConfigUpdater } from './tpaCommonConfigUpdater'
import { tpaDataCapsule } from './tpaDataCapsule'
import { TpaHandlersManagerSymbol } from 'feature-tpa-commons'
import { TpaPageNavigationDispatcher } from './TpaPageNavigationDispatcher'
import { Tpa } from './tpa'
import { TpaStateManager } from './tpaStateManager'
import { UrlChangeHandlerForPage } from 'feature-router'
import { TpaCurrentCurrencyManager } from './tpaCurrentCurrencyManager'

export const page: ContainerModuleLoader = (bind, bindAll) => {
	bindAll([LifeCycle.PageWillMountHandler, LifeCycle.PageWillUnmountHandler, TpaSymbol], Tpa)
	bind(TpaHandlersManagerSymbol).to(TpaHandlersManager)
	bindAll([TpaHandlerProviderSymbol, WixCodeSdkHandlersProviderSym], publicApiTPAHandler)
	bind(TpaEventsListenerManagerSymbol).to(TpaEventsListenerManager)
	bind(LifeCycle.AppDidLoadPageHandler).to(TpaPageNavigationDispatcher)
	bindAll([LifeCycle.PageDidMountHandler, LifeCycle.PageDidUnmountHandler, TpaPopupSymbol], TpaPopupFactory)
	handlers.forEach((factory) => {
		// TODO fetch and bind only handlers we need https://jira.wixpress.com/browse/PLAT-715
		bind(TpaHandlerProviderSymbol).to(factory)
	})
	bindAll([LifeCycle.PageDidMountHandler, LifeCycle.PageDidUnmountHandler], TpaBroadcastManager)
	bindAll([LifeCycle.PageDidMountHandler, TpaModalSymbol], TpaModal)
	bind(LifeCycle.PageWillMountHandler).to(SiteScrollDispatcher)
	bind(TpaFullScreenModeSymbol).to(TpaFullScreenMode)
	bind(LifeCycle.PageWillMountHandler).to(tpaCommonConfigUpdater)
	if (process.env.browser) {
		bind(LifeCycle.PageWillMountHandler).to(tpaDataCapsule)
	}
	bind(UrlChangeHandlerForPage).to(TpaStateManager)
	bind(UrlChangeHandlerForPage).to(TpaCurrentCurrencyManager)
}

export {
	ITpaPopup,
	TpaPopupOrigin,
	TpaPopupPlacement,
	OpenModalOptions,
	BaseResponse,
	ITpaModal,
	OpenPopupOptions,
	ITpaFullScreenMode,
	ITPAEventsListenerManager,
} from './types'
export { TpaPopupSymbol, TpaEventsListenerManagerSymbol }
export { TpaModalSymbol, TpaSymbol }
export { TpaFullScreenModeSymbol }

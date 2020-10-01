import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, LinkClickHandlerSymbol } from '@wix/thunderbolt-symbols'
import { SamePageScroll } from './samePageScroll'
import { PostNavigationScroll } from './postNavigationScroll'
import { SamePageScrollSymbol } from './symbols'
import { SamePageScrollClickHandler } from './samePageScrollClickHandler'
import { ISamePageScroll } from './types'
import { SamePageAnchorHrefUpdater } from './samePageAnchorHrefUpdater'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.AppDidLoadPageHandler).to(PostNavigationScroll)
	bind(SamePageScrollSymbol).to(SamePageScroll)
	bind(LinkClickHandlerSymbol).to(SamePageScrollClickHandler)
	bind(LifeCycle.PageWillMountHandler).to(SamePageAnchorHrefUpdater)
}

export { name, SamePageScrollSymbol } from './symbols'

// Public Types
export { ISamePageScroll }

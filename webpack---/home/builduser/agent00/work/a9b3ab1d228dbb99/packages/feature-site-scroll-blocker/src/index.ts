import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { SiteScrollBlockerSymbol, name } from './symbols'
import { ISiteScrollBlocker, IScrollBlockedListener } from './ISiteScrollBlocker'
import { SiteScrollBlocker } from './siteScrollBlocker'

export const site: ContainerModuleLoader = (bind) => {
	bind(SiteScrollBlockerSymbol).to(SiteScrollBlocker)
}

export { name, SiteScrollBlockerSymbol, ISiteScrollBlocker, IScrollBlockedListener }

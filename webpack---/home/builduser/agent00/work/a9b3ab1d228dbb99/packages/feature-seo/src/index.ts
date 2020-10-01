import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { SeoSiteSymbol } from './symbols'
import { SeoPage } from './seo-page'
import { SeoSite } from './seo-site'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageWillMountHandler).to(SeoPage)
}

export const site: ContainerModuleLoader = (bind) => {
	bind(SeoSiteSymbol).to(SeoSite)
}

export { SeoSiteSymbol }
export * from './symbols'
export * from './types'
export { DEFAULT_STATUS_CODE } from './api/constants'

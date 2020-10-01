import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, PageScrollRegistrarSymbol } from '@wix/thunderbolt-symbols'
import { PageScroll } from './pageScrollRegistrar'
import { name } from './symbols'

export const page: ContainerModuleLoader = (bind, bindAll) => {
	bindAll([LifeCycle.PageDidMountHandler, LifeCycle.PageDidUnmountHandler, PageScrollRegistrarSymbol], PageScroll)
}

export * from './types'
export { name, PageScrollRegistrarSymbol }

import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { name } from './symbols'
import { ClickHandlerRegistrar } from './clickHandlerRegistrar'
import { LifeCycle, IPageDidMountHandler } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind<IPageDidMountHandler>(LifeCycle.PageDidMountHandler).to(ClickHandlerRegistrar)
}

export { name }

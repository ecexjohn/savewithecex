import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ReducedMotion } from './reducedMotion'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageWillMountHandler).to(ReducedMotion)
}

import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ScrollRestoration } from './scrollRestoration'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageDidUnmountHandler).to(ScrollRestoration)
}

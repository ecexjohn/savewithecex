import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { BackgroundGroup } from './backgroundGroup'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.AppWillLoadPageHandler).to(BackgroundGroup)
}

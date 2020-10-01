import { ComponentsRegistrarSymbol } from '@wix/thunderbolt-components-loader'
import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ComponentsRegistrar } from './components/componentsRegistrar'

export const site: ContainerModuleLoader = (bind) => {
	bind(ComponentsRegistrarSymbol).to(ComponentsRegistrar)
}

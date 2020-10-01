import { RendererPropsExtenderSym, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import {
	ComponentLibraries,
	ComponentsLoaderRegistry,
	ComponentLoaderFunction,
	ThunderboltHostAPI,
	CompController,
	CreateCompControllerArgs,
	CompControllersRegistry,
	ComponentsRegistry,
	UpdateCompProps,
	IComponentsRegistrar,
} from './types'
import { ComponentsLoaderSymbol, ComponentsRegistrarSymbol } from './symbols'
import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ComponentsLoaderInit } from './componentsLoaderInit'
import { ComponentsLoader } from './componentsLoader'
import { IComponentsLoader } from './IComponentLoader'
import { controlledComponentFactory } from './updateControlledComponentProps'

// Public loader
export const site: ContainerModuleLoader = (bind, bindAll) => {
	bind(RendererPropsExtenderSym).to(ComponentsLoaderInit)
	bind(ComponentsLoaderSymbol).to(ComponentsLoader)
	bindAll([RendererPropsExtenderSym, WixCodeSdkHandlersProviderSym], controlledComponentFactory)
}

// Public Symbols
export { ComponentsLoaderSymbol, ComponentsRegistrarSymbol }

// Public Types
export {
	IComponentsLoader,
	ComponentLibraries,
	IComponentsRegistrar,
	ComponentsLoaderRegistry,
	ComponentLoaderFunction,
	ThunderboltHostAPI,
	CompController,
	CreateCompControllerArgs,
	CompControllersRegistry,
	ComponentsRegistry,
	UpdateCompProps,
}

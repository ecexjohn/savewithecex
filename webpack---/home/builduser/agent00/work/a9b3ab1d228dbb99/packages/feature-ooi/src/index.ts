import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import OOI from './ooi'
import { LifeCycle, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { ReactLoaderForOOISymbol } from './symbols'
import { ooiComponentsRegistrar } from './ooiComponentsRegistrar'
import { ComponentsRegistrarSymbol } from '@wix/thunderbolt-components-loader'

export const page: ContainerModuleLoader = (bind, bindAll) => {
	bindAll([LifeCycle.PageWillMountHandler, WixCodeSdkHandlersProviderSym], OOI)
}

export const site: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(ReactLoaderForOOISymbol).to(require('./componentsLoaderClient').default)
	} else {
		bind(ReactLoaderForOOISymbol).to(require('./componentsLoaderSSR').default)
	}
	bind(ComponentsRegistrarSymbol).to(ooiComponentsRegistrar)
}

export * from './types'
export * from './symbols'

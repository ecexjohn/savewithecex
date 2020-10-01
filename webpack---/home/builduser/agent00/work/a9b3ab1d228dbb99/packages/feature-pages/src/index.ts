import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { PageProviderSymbol } from './symbols'
import { IPageReflector, IPageProvider } from './types'
import { PageProvider } from './PageReflector'

export const site: ContainerModuleLoader = (bind) => {
	bind<IPageProvider>(PageProviderSymbol).toProvider<IPageReflector>(PageProvider)
}

export { PageProviderSymbol, IPageProvider, IPageReflector }

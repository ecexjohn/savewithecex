import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, HeadContentSymbol, RendererSymbol, ComponentsStylesOverridesSymbol } from '@wix/thunderbolt-symbols'
import { RendererProps, AppProps, ClientRenderResponse, BatchingStrategy, IRendererPropsProvider } from './types'
import { HeadContent } from './HeadContent'
import { RendererPropsProvider } from './RendererPropsProvider'
import { ReactClientRenderer } from './clientRenderer/reactClientRenderer'
import { ReactDomLoader } from './clientRenderer/reactDomLoader'
import { PageMountUnmountSubscriber } from './clientRenderer/pageMountUnmountSubscriber'
import { ClientBatchingStrategy } from './components/batchingStrategy'
import { ComponentsStylesOverrides } from './ComponentsStylesOverrides'
import { RendererPropsProviderSym, BatchingStrategySymbol } from './symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind(RendererSymbol).to(ReactClientRenderer)
	bind(RendererPropsProviderSym).to(RendererPropsProvider)
	bind(BatchingStrategySymbol).to(ClientBatchingStrategy)
	bind(LifeCycle.AppWillMountHandler).to(ReactDomLoader)
	bind(HeadContentSymbol).to(HeadContent)
	bind(LifeCycle.AppWillLoadPageHandler).to(PageMountUnmountSubscriber)
	bind(ComponentsStylesOverridesSymbol).to(ComponentsStylesOverrides)
}

export {
	RendererProps,
	AppProps,
	ClientRenderResponse,
	BatchingStrategy,
	RendererPropsProviderSym,
	IRendererPropsProvider,
}

export { BatchingStrategySymbol } from './symbols'

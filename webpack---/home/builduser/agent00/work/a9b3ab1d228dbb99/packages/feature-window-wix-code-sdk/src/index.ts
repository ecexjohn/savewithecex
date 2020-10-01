import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { windowWixCodeSdkHandlers } from './sdk/windowSdkProvider'

export const page: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(windowWixCodeSdkHandlers)
}

export * from './symbols'
export * from './types'

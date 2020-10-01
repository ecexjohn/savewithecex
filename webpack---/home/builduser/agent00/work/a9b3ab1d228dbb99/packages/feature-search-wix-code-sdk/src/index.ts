import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkParamsProviderSym } from '@wix/thunderbolt-symbols'
import { searchWixCodeSdkParamsProvider } from './sdk/searchSdkProvider'

export const site: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkParamsProviderSym).to(searchWixCodeSdkParamsProvider)
}

export * from './symbols'
export * from './types'

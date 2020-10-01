import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkParamsProviderSym } from '@wix/thunderbolt-symbols'
import { wixEventsWixCodeSdkParamsProvider } from './sdk/wixEventsSdkProvider'

export const site: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkParamsProviderSym).to(wixEventsWixCodeSdkParamsProvider)
}

export * from './symbols'
export * from './types'

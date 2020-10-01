import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkParamsProviderSym } from '@wix/thunderbolt-symbols'
import { paidPlansWixCodeSdkParamsProvider } from './sdk/paidPlansSdkProvider'

export const site: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkParamsProviderSym).to(paidPlansWixCodeSdkParamsProvider)
}

export * from './symbols'
export * from './types'

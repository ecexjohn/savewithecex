import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym, WixCodeSdkParamsProviderSym, LifeCycle } from '@wix/thunderbolt-symbols'
import { siteMembersWixCodeSdkHandlers, siteMembersWixCodeSdkParamsProvider } from './sdk/siteMembersSdkProvider'

export const site: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkParamsProviderSym).to(siteMembersWixCodeSdkParamsProvider)
}

export const page: ContainerModuleLoader = (bind, bindAll) => {
	bindAll([WixCodeSdkHandlersProviderSym, LifeCycle.PageDidMountHandler], siteMembersWixCodeSdkHandlers)
}

export * from './symbols'
export * from './types'

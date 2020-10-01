import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { UrlChangeHandlerForPage } from 'feature-router'
import { locationWixCodeSdkHandlersProvider } from './sdk/locationSdkProvider'

export const page: ContainerModuleLoader = (bind, bindAll) => {
	bindAll([WixCodeSdkHandlersProviderSym, UrlChangeHandlerForPage], locationWixCodeSdkHandlersProvider)
}

export * from './symbols'
export * from './types'

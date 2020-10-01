import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { animationsWixCodeSdkParamsProvider } from './sdk/animationsSdkProvider'
import { animationsWixCodeSdkParamsProviderSSR } from './sdk/animationsSdkProviderSSR'

export const page: ContainerModuleLoader = (bind, bindAll) => {
	if (process.env.browser) {
		bindAll([WixCodeSdkHandlersProviderSym, LifeCycle.PageDidUnmountHandler], animationsWixCodeSdkParamsProvider)
	} else {
		bind(WixCodeSdkHandlersProviderSym).to(animationsWixCodeSdkParamsProviderSSR)
	}
}

export * from './symbols'
export * from './types'

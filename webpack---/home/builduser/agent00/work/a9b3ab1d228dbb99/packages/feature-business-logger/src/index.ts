import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { BusinessLoggerFactory } from './businessLogger'
import { BsiManagerSymbol, name, PageNumberSymbol } from './symbols'
import { LifeCycle, WixCodeSdkHandlersProviderSym, BusinessLoggerSymbol } from '@wix/thunderbolt-symbols'
import { bsiSdkHandlersProvider } from './bsiSdkHandlersProvider'
import { BsiManager } from './bsiManager'
import { PageNumberHandler } from './pageNumber'

export const site: ContainerModuleLoader = (bind, bindAll) => {
	bind(BusinessLoggerSymbol).to(BusinessLoggerFactory)
	bind(BsiManagerSymbol).to(BsiManager)
	if (process.env.browser) {
		bindAll([PageNumberSymbol, LifeCycle.AppWillLoadPageHandler], PageNumberHandler)
	}
}

export const page: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(bsiSdkHandlersProvider)
}

export { BusinessLogger, IBsiManager, IPageNumber } from './types'
export { BsiManagerSymbol, PageNumberSymbol, name }

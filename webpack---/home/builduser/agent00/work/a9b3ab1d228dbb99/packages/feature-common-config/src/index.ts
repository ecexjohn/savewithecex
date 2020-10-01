import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { CommonConfigImpl } from './commonConfig'
import { CommonConfigSymbol, name } from './symbols'
import { ICommonConfig } from './types'
import { commonConfigSdkHandlersProvider } from './commonConfigSdkHandlersProvider'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'

export { CommonConfigSymbol, ICommonConfig, name }

export const site: ContainerModuleLoader = (bind) => {
	bind(CommonConfigSymbol).to(CommonConfigImpl)
}

export const page: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(commonConfigSdkHandlersProvider)
}

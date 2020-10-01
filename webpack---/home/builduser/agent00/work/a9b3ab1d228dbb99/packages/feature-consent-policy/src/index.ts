import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ConsentPolicySymbol } from './symbols'
import { ConsentPolicyBrowser } from './consentPolicyBrowser'

export const site: ContainerModuleLoader = (bind) => {
	bind(ConsentPolicySymbol).to(ConsentPolicyBrowser)
}

export * from './types'
export * from './symbols'

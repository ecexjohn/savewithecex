import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Pubsub, TPA_PUB_SUB_PREFIX, stripPubSubPrefix } from './pubsub'
import { PlatformPubsubSymbol, name } from './symbols'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { pubsubSdkHandlers } from './sdk/pubsubSdkProvider'

export const page: ContainerModuleLoader = (bind) => {
	bind(PlatformPubsubSymbol).to(Pubsub)
	bind(WixCodeSdkHandlersProviderSym).to(pubsubSdkHandlers)
}

export * from './types'
export { PlatformPubsubSymbol, name, TPA_PUB_SUB_PREFIX, stripPubSubPrefix }

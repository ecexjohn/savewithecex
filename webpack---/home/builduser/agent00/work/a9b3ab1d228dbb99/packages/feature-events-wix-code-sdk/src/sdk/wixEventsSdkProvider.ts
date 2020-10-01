import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { WixCodeSdkParamsProvider, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { WixEventsWixCodeSdkFactoryInitialState } from '../types'
import { name } from '../symbols'

/**
 * you may depend on any symbol from https://github.com/wix-private/thunderbolt/tree/7b409d8d1b75a570fee8b84f46ce7db0d9a8bfae/packages/thunderbolt-symbols/src/symbols
 */
export const wixEventsWixCodeSdkParamsProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name)],
	(): WixCodeSdkParamsProvider<WixEventsWixCodeSdkFactoryInitialState> => ({
		[name]: {
			initialState: {},
		},
	})
)

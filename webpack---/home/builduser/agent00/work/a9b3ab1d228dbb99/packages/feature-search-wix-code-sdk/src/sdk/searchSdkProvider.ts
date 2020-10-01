import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { WixCodeSdkParamsProvider, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { SearchWixCodeSdkFactoryInitialState, SearchWixCodeSdkSiteConfig } from '../types'
import { name } from '../symbols'

export const searchWixCodeSdkParamsProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name)],
	(siteConfig: SearchWixCodeSdkSiteConfig): WixCodeSdkParamsProvider<SearchWixCodeSdkFactoryInitialState> => ({
		[name]: {
			initialState: {
				language: siteConfig.language,
			},
		},
	})
)

import { PlatformUtils, PlatformEnvData } from '../../../thunderbolt-symbols/src'
import { namespace } from '..'
import {
	SearchWixCodeSdkFactoryInitialState,
	NamespacedSearchWixCodeSdkWixCodeApi,
	SearchWixCodeSdkHandlers,
} from '../types'
import WixSearchBuilder from '../builder/search'
import WixSearchFilterBuilder from '../builder/filter'
import WixSearchClient from '../util/client'
import { getInstance } from '../util/auth'
import { currentLanguage } from '../util/language'

const SearchSdkFactory = (
	{ language }: SearchWixCodeSdkFactoryInitialState,
	_: SearchWixCodeSdkHandlers,
	{ sessionServiceApi }: PlatformUtils,
	{ multilingual }: PlatformEnvData
): NamespacedSearchWixCodeSdkWixCodeApi => ({
	[namespace]: {
		search: (query) =>
			new WixSearchBuilder({
				query,
				client: new WixSearchClient(getInstance(sessionServiceApi)),
				fuzzy: true,
				highlight: false,
				language: currentLanguage(language, multilingual),
			}),
		filter: () => new WixSearchFilterBuilder(),
	},
})

export { SearchSdkFactory }

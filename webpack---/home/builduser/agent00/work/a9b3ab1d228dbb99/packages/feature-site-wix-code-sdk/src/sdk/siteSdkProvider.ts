import { optional, withDependencies } from '@wix/thunderbolt-ioc'
import { SdkHandlersProvider, DynamicPagesSymbol } from '@wix/thunderbolt-symbols'
import { DynamicPagesAPI, FetchParams } from 'feature-router'

export const siteSdkProvider = withDependencies(
	[optional(DynamicPagesSymbol)],
	(dynamicPagesAPI: DynamicPagesAPI): SdkHandlersProvider => ({
		getSdkHandlers: () => {
			return {
				getSitemapFetchParams: (routePrefix: string): FetchParams | null => {
					if (!dynamicPagesAPI) {
						return null
					}

					return dynamicPagesAPI.getSitemapFetchParams(routePrefix)
				},
			}
		},
	})
)

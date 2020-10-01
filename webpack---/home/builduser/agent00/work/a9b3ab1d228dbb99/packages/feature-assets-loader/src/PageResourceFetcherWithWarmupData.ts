import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { IWarmupDataProvider, WarmupDataProviderSymbol } from 'feature-warmup-data'
import { PageResourceFetcherSymbol, name } from './symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { FeatureStateSymbol, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { IPageResourceFetcher } from './IPageResourceFetcher'
import { SiteAssetsFeatureState, SiteAssetsWarmupData, AssetsLoaderSiteConfig } from './types'

type ResourceFetcherFactory = (
	pageResourceFetcher: IPageResourceFetcher,
	warmupDataProvider: IWarmupDataProvider,
	featureState: IFeatureState<SiteAssetsFeatureState>,
	siteConfig: AssetsLoaderSiteConfig
) => IPageResourceFetcher

const WARMUP_DATA_TIMEOUT = 2000

const resourceFetcher: ResourceFetcherFactory = (pageResourceFetcher, warmupDataProvider, featureState, siteConfig) => {
	if (!siteConfig.enrichWarmupData) {
		return pageResourceFetcher
	}
	return {
		async fetchResource(pageCompId, resourceType, fallbackStrategy) {
			const key = [pageCompId, resourceType].join('_')

			if (!featureState.get()?.[key]) {
				const warmupDataPromise = Promise.race([
					warmupDataProvider.getWarmupData<SiteAssetsWarmupData>('siteAssets'),
					new Promise<null>((resolve) => setTimeout(() => resolve(null), WARMUP_DATA_TIMEOUT)),
				])

				featureState.update((prev) => ({
					...prev,
					[key]: warmupDataPromise.then(
						(data) =>
							(data && data[key]) ||
							pageResourceFetcher.fetchResource(pageCompId, resourceType, fallbackStrategy)
					),
				}))
			}

			return featureState.get()[key]
		},
		getResourceUrl(pageCompId, resourceType): string {
			return pageResourceFetcher.getResourceUrl(pageCompId, resourceType)
		},
	}
}

export const PageResourceFetcherWithWarmupData = withDependencies<IPageResourceFetcher>(
	[
		PageResourceFetcherSymbol,
		WarmupDataProviderSymbol,
		named(FeatureStateSymbol, name),
		named(SiteFeatureConfigSymbol, name),
	],
	resourceFetcher
)

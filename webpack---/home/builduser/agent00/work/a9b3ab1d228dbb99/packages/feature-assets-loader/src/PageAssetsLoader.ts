import { withDependencies } from '@wix/thunderbolt-ioc'
import { PageStyleLoaderSymbol, PageResourceFetcherWithWarmupDataSymbol } from './symbols'
import { ILoadPageStyle } from './PageStyleLoader'
import { SiteAssetsResources, IPageAssetsLoader, PageAssets } from '@wix/thunderbolt-symbols'
import { IPageResourceFetcher } from './IPageResourceFetcher'

type PageAssetsLoaderFactory = (
	pageResourceFetcher: IPageResourceFetcher,
	pageStyleLoader: ILoadPageStyle
) => IPageAssetsLoader

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

const createPageAssetsExtractor = (pageFeatures: Promise<SiteAssetsResources['features']>) => <
	K extends keyof PageAssets
>(
	extractor: (result: ThenArg<SiteAssetsResources['features']>) => ThenArg<PageAssets[K]>,
	fallabckValue: ThenArg<PageAssets[K]>
) => pageFeatures.catch(() => null).then((result) => (result === null ? fallabckValue : extractor(result)))

const pageAssetsLoaderImplFactory: PageAssetsLoaderFactory = (pageResourceFetcher, pageStyleLoader) => {
	const assetsCache: Record<string, PageAssets> = {}

	const createPageAssets = (pageCompId: string): PageAssets => {
		const addCssPromise = pageStyleLoader.load(pageCompId)
		const pageFeatures = pageResourceFetcher.fetchResource(pageCompId, 'features', 'enable')

		const extractByPageAssetType = createPageAssetsExtractor(pageFeatures)

		return {
			components: extractByPageAssetType<'components'>(({ structure: { components } }) => components, {}),
			features: extractByPageAssetType<'features'>(({ structure: { features } }) => features, []),
			siteFeaturesConfigs: extractByPageAssetType<'siteFeaturesConfigs'>(
				({ structure: { siteFeaturesConfigs } }) => siteFeaturesConfigs,
				{}
			),
			props: extractByPageAssetType<'props'>(({ props }) => props, { render: { compProps: {} } }),
			css: addCssPromise,
		}
	}

	return {
		load: (pageCompId: string) => {
			assetsCache[pageCompId] = assetsCache[pageCompId] || createPageAssets(pageCompId)
			return assetsCache[pageCompId]
		},
	}
}

export const PageAssetsLoaderImpl = withDependencies(
	[PageResourceFetcherWithWarmupDataSymbol, PageStyleLoaderSymbol],
	pageAssetsLoaderImplFactory
)

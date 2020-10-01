import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { PageResourceFetcher } from './PageResourceFetcher'
import { IPageResourceFetcher } from './IPageResourceFetcher'
import { PageResourceFetcherSymbol, PageStyleLoaderSymbol, PageResourceFetcherWithWarmupDataSymbol } from './symbols'
import { PageAssetsLoaderImpl } from './PageAssetsLoader'
import { ILoadPageStyle, ClientPageStyleLoader, ServerPageStyleLoader } from './PageStyleLoader'
import { IPageAssetsLoader, PageAssetsLoaderSymbol } from '@wix/thunderbolt-symbols'
import { PageResourceFetcherWithWarmupData } from './PageResourceFetcherWithWarmupData'
import { WarmupDataEnricherSymbol } from 'feature-warmup-data'
import { SiteAssetsWarmupDataEnricher } from './SiteAssetsWarmupDataEnricher'

export const site: ContainerModuleLoader = (bind) => {
	bind<IPageResourceFetcher>(PageResourceFetcherSymbol).to(PageResourceFetcher)
	bind<IPageResourceFetcher>(PageResourceFetcherWithWarmupDataSymbol).to(PageResourceFetcherWithWarmupData)
	bind<IPageAssetsLoader>(PageAssetsLoaderSymbol).to(PageAssetsLoaderImpl)
	if (process.env.browser) {
		bind<ILoadPageStyle>(PageStyleLoaderSymbol).to(ClientPageStyleLoader)
	} else {
		bind(WarmupDataEnricherSymbol).to(SiteAssetsWarmupDataEnricher)
		bind<ILoadPageStyle>(PageStyleLoaderSymbol).to(ServerPageStyleLoader)
	}
}

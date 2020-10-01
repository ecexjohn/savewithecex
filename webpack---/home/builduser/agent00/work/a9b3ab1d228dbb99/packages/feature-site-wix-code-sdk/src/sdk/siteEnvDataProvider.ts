import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol, PlatformEnvDataProvider, SiteWixCodeSdkSiteConfig } from '@wix/thunderbolt-symbols'
import { name } from '../symbols'

export const siteEnvDataProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name)],
	({ pageIdToTitle }: SiteWixCodeSdkSiteConfig): PlatformEnvDataProvider => ({
		platformEnvData: {
			site: {
				pageIdToTitle,
			},
		},
	})
)

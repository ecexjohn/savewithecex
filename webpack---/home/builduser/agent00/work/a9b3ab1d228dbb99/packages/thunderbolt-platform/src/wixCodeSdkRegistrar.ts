import { PlatformSymbol, WixCodeSdkParamsProvider, WixCodeSdkParamsProviderSym } from '@wix/thunderbolt-symbols'
import { multi, withDependencies } from '@wix/thunderbolt-ioc'
import { IPlatform } from './types'

function WixCodeSdkSiteProvidersRegistrar(platform: IPlatform, wixCodeSdkProviders: Array<WixCodeSdkParamsProvider<any>>) {
	platform.registerWixCodeSdkParams(Object.assign({}, ...wixCodeSdkProviders))
	return {
		appWillMount() {}
	}
}

export const siteFeaturesSdkProviders = withDependencies<any>([PlatformSymbol, multi(WixCodeSdkParamsProviderSym)], WixCodeSdkSiteProvidersRegistrar)

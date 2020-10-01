import { withDependencies } from '@wix/thunderbolt-ioc'
import { SdkHandlersProvider, CurrentRouteInfoSymbol, PlatformEnvDataProvider } from '@wix/thunderbolt-symbols'
import { SeoWixCodeSdkHandlers } from '../types'
import { SeoSiteSymbol, ISeoSiteApi } from 'feature-seo'
import { ICurrentRouteInfo } from 'feature-router'

const SeoPlatformEnvDataProvider = (seoApi: ISeoSiteApi): PlatformEnvDataProvider => {
	const siteLevelSeoData = seoApi.getSiteLevelSeoData()
	return {
		platformEnvData: {
			seo: {
				...siteLevelSeoData,
			},
		},
	}
}

const SeoWixCodeSdkHandlersFactory = (
	seoApi: ISeoSiteApi,
	routeApi: ICurrentRouteInfo
): SdkHandlersProvider<SeoWixCodeSdkHandlers> => {
	return {
		getSdkHandlers() {
			return {
				async setTitle(title) {
					await seoApi.setCorvidTitle(title)
					seoApi.renderSEO()
				},
				async setLinks(links) {
					await seoApi.setCorvidLinks(links)
					seoApi.renderSEO()
				},
				async setMetaTags(metaTags) {
					await seoApi.setCorvidMetaTags(metaTags)
					seoApi.renderSEO()
				},
				async setStructuredData(structuredData) {
					await seoApi.setCorvidStructuredData(structuredData)
					seoApi.renderSEO()
				},
				async setSeoStatusCode(seoStatusCode) {
					await seoApi.setCorvidSeoStatusCode(seoStatusCode)
				},
				async renderSEOTags(payload) {
					seoApi.setCorvidSeoTags(payload)
					seoApi.renderSEO()
				},
				async resetSEOTags() {
					await seoApi.resetCorvidSeoTags()
					seoApi.renderSEO()
				},
				onTPAOverrideChanged(cb) {
					seoApi.onTPAOverridesChanged(cb)
				},
				async getDynamicRouteData() {
					const dynamicRoutePayload = routeApi.getCurrentRouteInfo()?.dynamicRouteData
					return seoApi.extractDynamicRouteData(dynamicRoutePayload)
				},
			}
		},
	}
}

export const seoPlatformEnvDataProvider = withDependencies([SeoSiteSymbol], SeoPlatformEnvDataProvider)
export const seoWixCodeSdkHandlersProvider = withDependencies(
	[SeoSiteSymbol, CurrentRouteInfoSymbol],
	SeoWixCodeSdkHandlersFactory
)

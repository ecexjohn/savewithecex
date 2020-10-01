import { FallbackStrategy, SiteAssetsRequest, SitePagesModel } from 'site-assets-client'
import { TBSiteAssetsRequest } from './types'
import { stringifyExperiments } from './utils'
import {
	CssSiteAssetsParams,
	Experiments,
	ModulesToHashes,
	PlatformSiteAssetsParams,
	FeaturesSiteAssetsParams,
	SiteAssetsResourceType,
	SiteScopeParams,
	ViewerModel,
} from '@wix/thunderbolt-symbols'

type OneOfSiteAssetsParams = CssSiteAssetsParams | PlatformSiteAssetsParams | FeaturesSiteAssetsParams

type SiteAssetsParamsMap<U> = { [K in SiteAssetsResourceType]: U extends { resourceType: K } ? U : never }
type SiteAssetsParamsTypeMap = SiteAssetsParamsMap<OneOfSiteAssetsParams>
type Pattern<T> = { [K in keyof SiteAssetsParamsTypeMap]: (params: SiteAssetsParamsTypeMap[K]) => T }
function matcher<T>(pattern: Pattern<T>): (params: OneOfSiteAssetsParams) => T {
	// https://github.com/Microsoft/TypeScript/issues/14107
	return (params) => pattern[params.resourceType](params as any)
}

export const getUniqueParamsPerModule = ({
	deviceInfo,
	staticHTMLComponentUrl,
	qaMode,
}: {
	deviceInfo: ViewerModel['deviceInfo']
	staticHTMLComponentUrl: string
	qaMode?: ViewerModel['mode']['qa']
}) => {
	return matcher<Record<string, string>>({
		css: ({ language, stylableMetaData, isInSeo }) => {
			return {
				language,
				stylableMetaData,
				deviceType: deviceInfo.deviceClass,
				isInSeo: isInSeo ? `${isInSeo}` : 'false',
			}
		},
		features: ({ language, originalLanguage, isInSeo, useSandboxInHTMLComp }) => {
			return {
				language,
				originalLanguage,
				useSandboxInHTMLComp: `${useSandboxInHTMLComp}`,
				deviceType: deviceInfo.deviceClass,
				osType: deviceInfo.os,
				staticHTMLComponentUrl,
				...(qaMode && { qaMode: 'true' }),
				isInSeo: isInSeo ? `${isInSeo}` : 'false',
			}
		},
		platform: ({ language }) => {
			return {
				language,
			}
		},
	})
}

export const getCommonParams = (
	{
		freemiumBanner,
		coBrandingBanner,
		viewMode,
		isWixSite,
		isResponsive,
		wixCodePageIds,
		isPremiumDomain,
		tbElementsSiteAssets,
	}: SiteScopeParams,
	{ errorPageId, pageCompId }: TBSiteAssetsRequest,
	beckyExperiments: Experiments,
	remoteWidgetStructureBuilderVersion: string
) => {
	const isWixCodeOnPage = () => {
		if (!wixCodePageIds) {
			return
		}
		if (pageCompId === 'masterPage') {
			/*
			 * page user code can trigger handlers of master page components.
			 * we need platformApi.hasPlatformOnPage to return true for master page
			 * in order for the platform handlers to be present on the master page container.
			 */
			return `${wixCodePageIds.length > 0}`
		}
		return `${wixCodePageIds.includes(pageCompId)}`
	}

	const params = {
		freemiumBanner: freemiumBanner ? `${freemiumBanner}` : undefined,
		coBrandingBanner: coBrandingBanner ? `${coBrandingBanner}` : undefined,
		isPremiumDomain: isPremiumDomain ? `${isPremiumDomain}` : undefined,
		isWixCodeOnPage: isWixCodeOnPage(),
		viewMode: viewMode || undefined,
		isWixSite: isWixSite ? `${isWixSite}` : undefined,
		tbElementsSiteAssets,
		errorPageId: errorPageId || undefined,
		isResponsive: isResponsive ? `${isResponsive}` : undefined,
		beckyExperiments: stringifyExperiments(beckyExperiments) || undefined,
		remoteWidgetStructureBuilderVersion,
	}

	return Object.entries(params).reduce(
		(returnValue, [key, value]) => (value ? { ...returnValue, [key]: value } : returnValue),
		{}
	)
}

export function toSiteAssetsRequest(
	request: TBSiteAssetsRequest,
	modulesToHashes: ModulesToHashes,
	pageJsonFileNames: SitePagesModel['pageJsonFileNames'],
	fallbackStrategy: FallbackStrategy,
	siteScopeParams: SiteScopeParams,
	beckyExperiments: Experiments,
	staticHTMLComponentUrl: string,
	remoteWidgetStructureBuilderVersion: string,
	deviceInfo: ViewerModel['deviceInfo'],
	qaMode?: boolean
) {
	const { moduleParams, pageCompId, pageJsonFileName } = request
	const { contentType, moduleName } = moduleParams

	const siteAssetsRequest: SiteAssetsRequest = {
		endpoint: {
			controller: 'pages',
			methodName: 'thunderbolt',
		},
		module: {
			name: moduleName,
			version: modulesToHashes[moduleName],
			fetchType: 'file',
			params: {
				...getCommonParams(siteScopeParams, request, beckyExperiments, remoteWidgetStructureBuilderVersion),
				...getUniqueParamsPerModule({
					deviceInfo,
					staticHTMLComponentUrl,
					qaMode,
				})(moduleParams),
			},
		},
		contentType,
		fallbackStrategy,
		pageJsonFileName: pageJsonFileName || pageJsonFileNames[pageCompId],
	}

	return siteAssetsRequest
}

import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	HeadContentSymbol,
	IHeadContent,
	SiteFeatureConfigSymbol,
	HeadContentType,
	IMultilingual,
} from '@wix/thunderbolt-symbols'
import { MultilingualSymbol } from 'feature-multilingual'
import { SiteLevelSeoData, ISeoSiteApi, SeoPageConfig, SeoSiteState } from './types'
import { name } from './symbols'
import { DEFAULT_STATUS_CODE } from './api'
import { TbDebugSymbol, ISeoDebugHandlers } from 'feature-debug'

const seoSiteFactory = (
	siteLevelSeoData: SiteLevelSeoData,
	headUtils: IHeadContent,
	multilingualApi?: IMultilingual,
	tbDebug?: ISeoDebugHandlers
): ISeoSiteApi => {
	const state: SeoSiteState = {
		pageLevelData: {} as SeoPageConfig,
		tpaSeoEndpointData: [],
		tpaOverrides: [],
		corvidOverrides: [],
		corvidItemPayload: undefined,
		seoStatusCode: DEFAULT_STATUS_CODE,
		dynamicPageData: [],
		tpaOverridesListener: () => {},
	} as SeoSiteState
	if (multilingualApi) {
		siteLevelSeoData.context.currLangCode = multilingualApi.currentLanguage.languageCode
		siteLevelSeoData.context.currLangIsOriginal = multilingualApi.isOriginalLanguage
	}

	const extractDynamicRouteData: ISeoSiteApi['extractDynamicRouteData'] = async (
		payload,
		currentCorvidOverrides = []
	) => {
		if (payload) {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			const resolvedPageHeadData = await api.resolveDynamicPageHeadData(payload)
			const corvidOverrides = api.setExternalRouter(currentCorvidOverrides, resolvedPageHeadData)
			const dynamicPageData = await api.convertDynamicPageModel(resolvedPageHeadData)
			return {
				corvidOverrides,
				dynamicPageData,
			}
		}
	}

	const getTagsPayload = () => ({
		siteLevelSeoData,
		pageLevelSeoData: state.pageLevelData,
		corvidOverrides: state.corvidOverrides,
		corvidItemPayload: state.corvidItemPayload,
		tpaSeoEndpointData: state.tpaSeoEndpointData,
		tpaOverrides: state.tpaOverrides,
		dynamicPageData: state.dynamicPageData,
	})

	const seoApi: ISeoSiteApi = {
		getSiteLevelSeoData: (): SiteLevelSeoData => siteLevelSeoData,
		getSeoStatusCode: (): number => state.seoStatusCode,
		setPageData: (pageLevelSeoData: SeoPageConfig) => {
			state.pageLevelData = pageLevelSeoData
		},
		resetTpaAndCorvidData: () => {
			state.tpaOverrides = []
			state.corvidOverrides = []
			state.corvidItemPayload = undefined
			state.tpaOverridesListener(state.tpaOverrides)
		},
		setCorvidTitle: async (title) => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			state.corvidOverrides = api.setTitle(state.corvidOverrides, title)
		},
		setCorvidLinks: async (links) => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			state.corvidOverrides = api.setLinks(state.corvidOverrides, links)
		},
		setCorvidMetaTags: async (metaTags) => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			state.corvidOverrides = api.setMetaTags(state.corvidOverrides, metaTags)
		},
		setCorvidStructuredData: async (structuredData) => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			state.corvidOverrides = api.setSchemas(state.corvidOverrides, structuredData)
		},
		setCorvidSeoStatusCode: (seoStatusCode) => {
			state.seoStatusCode = seoStatusCode
		},
		setCorvidSeoTags: (payload) => {
			if (payload?.itemType && payload?.itemData) {
				state.corvidItemPayload = {
					asNewPage: true,
					seoData: {},
					...payload,
				}
			}
		},
		resetCorvidSeoTags: async () => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			state.corvidItemPayload = api.getDefaultItemPayload()
		},
		renderSEO: async () => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			const tags = api.getTags(getTagsPayload())
			const title = api.getTitle(tags)
			const staticMarkup = api.getStaticMarkup(tags).concat(siteLevelSeoData.customHeadTags)
			headUtils.setHead(staticMarkup, HeadContentType.SEO)
			api.setWindowTitle(title)
			return tags
		},
		isInSEO: () => siteLevelSeoData.isInSEO,
		getPageTitle: async () => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			const tags = api.getTags(getTagsPayload())
			const title = api.getTitle(tags)
			return title
		},
		setTPAOverrides: async (payload) => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			const { title, fullTitle, description } = payload
			if (fullTitle) {
				state.tpaOverrides = api.setTitle(state.tpaOverrides, fullTitle)
			} else if (title) {
				state.tpaOverrides = api.setTitle(state.tpaOverrides, title)
			}
			if (description) {
				state.tpaOverrides = api.setDescription(state.tpaOverrides, description)
			}
			state.tpaOverridesListener(state.tpaOverrides)
		},
		setTPAEndpointData: async (payload) => {
			const api = await import('./api/api' /* webpackChunkName: "seo-api" */)
			state.tpaSeoEndpointData = await api.convertTPAEndpointModel(payload)
		},
		resetTPAEndpointData: () => {
			state.tpaSeoEndpointData = []
		},
		setDynamicRouteOverrides: async (payload) => {
			if (payload) {
				const { corvidOverrides = state.corvidOverrides, dynamicPageData = state.dynamicPageData } =
					(await extractDynamicRouteData(payload, state.corvidOverrides)) || {}
				state.corvidOverrides = corvidOverrides
				state.dynamicPageData = dynamicPageData
			}
		},
		onTPAOverridesChanged: (cb) => (state.tpaOverridesListener = cb),
		extractDynamicRouteData,
	}

	if (tbDebug) {
		const omit = (prop: any, { [prop]: _, ...rest }) => rest
		const getSeoState = () => omit('tpaOverridesListener', state)
		return tbDebug.seoDebugProxy(seoApi, getSeoState) as ISeoSiteApi
	}
	return seoApi
}

export const SeoSite = withDependencies(
	[named(SiteFeatureConfigSymbol, name), HeadContentSymbol, optional(MultilingualSymbol), optional(TbDebugSymbol)],
	seoSiteFactory
)

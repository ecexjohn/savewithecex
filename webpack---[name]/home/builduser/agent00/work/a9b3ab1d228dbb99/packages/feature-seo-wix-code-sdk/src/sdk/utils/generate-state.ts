import { SeoWixCodeSdkFactoryState, SeoCorvidState, SeoCorvidPayload, SeoFactoryState } from '../../types'
import { DEFAULT_STATUS_CODE } from 'feature-seo'
import {
	getTitle,
	getLinks,
	getMetaTags,
	getSchemas,
	getInitialTags,
	getDefaultItemPayload,
} from '@wix/advanced-seo-utils/renderer-api'
import { getCorvidTags } from './get-corvid-overrides'

const generateCorvidState = ({
	tags = [],
	seoStatusCode = DEFAULT_STATUS_CODE,
	userOverrides = {},
	itemPayload = getDefaultItemPayload(),
	tpaOverrides = [] as Array<any>,
	dynamicPageData = [] as Array<any>,
}): SeoWixCodeSdkFactoryState => ({
	corvid: {
		title: getTitle(tags) || '',
		links: getLinks(tags) || [],
		metaTags: getMetaTags(tags) || [],
		structuredData: getSchemas(tags) || [],
		seoStatusCode,
	},
	userOverrides,
	itemPayload,
	tpaOverrides,
	dynamicPageData,
})

const initState = (payload: SeoCorvidPayload): SeoFactoryState => {
	const { siteLevelSeoData, pageLevelSeoData } = payload
	const state: SeoFactoryState['state'] = generateCorvidState({ ...payload, tags: getInitialTags(payload) })
	const setCorvidState: SeoFactoryState['setCorvidState'] = (partialState) => {
		state.corvid = { ...state.corvid, ...partialState }
		state.userOverrides = { ...state.userOverrides, ...partialState }
	}
	const setState: SeoFactoryState['setState'] = async (newCorvidPayload) => {
		const corvidPayload = {
			siteLevelSeoData,
			pageLevelSeoData,
			userOverrides: state.userOverrides,
			tpaOverrides: state.tpaOverrides,
			dynamicPageData: state.dynamicPageData,
			...newCorvidPayload,
		}
		const newState = await generateState(corvidPayload)
		Object.assign(state, newState)
	}
	return { state, setCorvidState, setState }
}

const generateState = async (payload: SeoCorvidPayload): Promise<SeoWixCodeSdkFactoryState> => {
	const {
		siteLevelSeoData,
		pageLevelSeoData,
		corvidState = {} as SeoCorvidState,
		corvidItemPayload = getDefaultItemPayload(),
		userOverrides = {},
		tpaOverrides = [] as Array<any>,
		dynamicPageData = [] as Array<any>,
	} = payload
	const { seoStatusCode } = corvidState
	const api = await import('@wix/advanced-seo-utils/renderer' /* webpackChunkName: "seo-api" */)
	const corvidOverrides = await getCorvidTags(corvidState)
	const tags = api.getTags({
		siteLevelSeoData,
		pageLevelSeoData,
		corvidOverrides,
		corvidItemPayload,
		tpaOverrides,
		dynamicPageData,
	})
	return generateCorvidState({
		tags,
		seoStatusCode,
		userOverrides,
		itemPayload: corvidItemPayload,
		tpaOverrides,
		dynamicPageData,
	})
}
export { initState }

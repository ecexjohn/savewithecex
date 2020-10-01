import { SeoCorvidState } from '../../types'

export const getCorvidTags = async (corvidOverrides: Partial<SeoCorvidState> = {}) => {
	let tags: Array<any> = []
	const api = await import('@wix/advanced-seo-utils/renderer' /* webpackChunkName: "seo-api" */)
	if (corvidOverrides.title) {
		tags = api.setTitle(tags, corvidOverrides.title)
	}
	if (corvidOverrides.links) {
		tags = api.setLinks(tags, corvidOverrides.links)
	}
	if (corvidOverrides.metaTags) {
		tags = api.setMetaTags(tags, corvidOverrides.links)
	}
	if (corvidOverrides.structuredData) {
		tags = api.setSchemas(tags, corvidOverrides.links)
	}
	return tags
}

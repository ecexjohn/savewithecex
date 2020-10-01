import { MetaTag, SiteLevelSeoData } from 'feature-seo'

import { SeoWixCodeSdkFactoryData, SeoWixCodeSdkHandlers, SeoWixCodeSdkWixCodeApi, Link, namespace } from '..'
import { initState } from './utils/generate-state'
import { PlatformEnvData, PlatformUtils } from '@wix/thunderbolt-symbols'

/**
 * SEO SDK Factory
 * API Docs: https://www.wix.com/corvid/reference/wix-seo.html
 */

export function SeoSdkFactory(
	pageLevelSeoData: SeoWixCodeSdkFactoryData,
	{
		setTitle,
		setLinks,
		setMetaTags,
		setSeoStatusCode,
		setStructuredData,
		renderSEOTags,
		resetSEOTags,
		onTPAOverrideChanged,
	}: SeoWixCodeSdkHandlers,
	platformUtils: PlatformUtils,
	platformEnvData: PlatformEnvData
): { [namespace]: SeoWixCodeSdkWixCodeApi } {
	const siteLevelSeoData = platformEnvData.seo as SiteLevelSeoData
	const { state, setCorvidState, setState } = initState({ siteLevelSeoData, pageLevelSeoData })

	if (process.env.browser) {
		onTPAOverrideChanged((tpaOverrides) => {
			state.tpaOverrides = tpaOverrides
		})
	}

	return {
		[namespace]: {
			get title() {
				return state.corvid.title
			},
			get links() {
				return state.corvid.links
			},
			get metaTags() {
				return state.corvid.metaTags
			},
			get structuredData() {
				return state.corvid.structuredData
			},
			get seoStatusCode() {
				return state.corvid.seoStatusCode
			},
			isInSEO() {
				return siteLevelSeoData.isInSEO
			},
			async setTitle(title: string) {
				setTitle(title)
				setCorvidState({ title })
			},
			async setLinks(links: Array<Link>) {
				setLinks(links)
				setCorvidState({ links })
			},
			async setMetaTags(metaTags: Array<MetaTag>) {
				const { resolveMetaTags } = await import(
					'feature-seo/src/api/resolve-meta-tags' /* webpackChunkName: "seo-api-utils" */
				)
				const resolvedMetaTags = (await resolveMetaTags(metaTags)) as Array<MetaTag>
				setMetaTags(resolvedMetaTags)
				setCorvidState({ metaTags: resolvedMetaTags })
			},
			async setStructuredData(structuredData: Array<Record<string, any>>) {
				setStructuredData(structuredData)
				setCorvidState({ structuredData })
			},
			async setSeoStatusCode(seoStatusCode: number) {
				setSeoStatusCode(seoStatusCode)
				setCorvidState({ seoStatusCode })
			},
			async renderSEOTags(payload) {
				renderSEOTags(payload)
				await setState({
					corvidState: state.corvid,
					corvidItemPayload: payload,
				})
			},
			async resetSEOTags() {
				resetSEOTags()
				await setState({
					corvidState: state.userOverrides,
				})
			},
		},
	}
}

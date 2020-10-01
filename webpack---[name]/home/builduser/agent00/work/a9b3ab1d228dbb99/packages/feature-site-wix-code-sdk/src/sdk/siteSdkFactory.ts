import _ from 'lodash'
import {
	OnInstanceChangedCallback,
	PlatformUtils,
	SiteWixCodeSdkWixCodeApi,
	SiteWixCodeSdkFactoryData,
	SiteWixCodeSdkPageConfig,
	AppPrefixData,
	PageData,
	StructurePageData,
	PlatformEnvData,
} from '@wix/thunderbolt-symbols'
import { logSdkError } from '@wix/thunderbolt-commons'
import { namespace } from '..'

const pagesType = {
	STATIC_PAGE_TYPE: 'static',
	TEMPLATE_PAGE_TYPE: 'template',
}

export function SiteSdkFactory(
	{
		regionalSettings,
		siteRevision,
		language,
		pagesData,
		nonPopupsPagesData,
		lightboxes,
		mainPageId,
		appsData,
		pageIdToPrefix,
		routerPrefixes,
		baseUrl,
		timezone,
		currency,
	}: SiteWixCodeSdkFactoryData & SiteWixCodeSdkPageConfig,
	handlers: any,
	platformUtils: PlatformUtils,
	{
		// TODO extract pageData from bi. we also have pageUrl and it's a duplicate of platformEnvData.location.rawUrl
		experiments,
		bi: {
			pageData: { isLightbox, pageId: currentPageId },
		},
	}: PlatformEnvData
): { [namespace]: SiteWixCodeSdkWixCodeApi } {
	const pageIdToAppDefId = _.reduce(
		nonPopupsPagesData,
		(result: { [key: string]: string }, pageData) => {
			const appId = pageData.tpaApplicationId
			// Bug fix for PLAT-829
			if (appId && appsData[appId]) {
				result[pageData.id] = appsData[appId].appDefinitionId
			}
			return result
		},
		{}
	)

	const appPrefixes = _.mapValues(
		pageIdToAppDefId,
		(appDefinitionId, pageId): AppPrefixData => {
			const pageData = pagesData[pageId]
			return {
				name: pageData.title,
				type: 'app',
				prefix: `/${pageData.pageUriSEO}`,
				applicationId: appDefinitionId,
			}
		}
	)

	const pages: Array<PageData> = _.map(nonPopupsPagesData, (pageData) => {
		const id = pageData.id
		const prefix = pageIdToPrefix[id]
		return {
			id,
			name: pageData.title,
			url: `/${pageData.pageUriSEO}`,
			type: prefix || pageIdToAppDefId[id] ? pagesType.TEMPLATE_PAGE_TYPE : pagesType.STATIC_PAGE_TYPE,
			..._.omitBy(
				{
					isHomePage: mainPageId === id,
					prefix,
					applicationId: pageIdToAppDefId[id],
					tpaPageId: pageData.tpaPageId,
				},
				(val) => _.isUndefined(val) || val === false
			),
		}
	})
	const structurePagesData: Array<StructurePageData> = _.map(pages, (page) => _.omit(page, 'tpaPageId'))

	const getSectionUrl = (
		sectionIdentifier: {
			sectionId: string
			appDefinitionId: string
		},
		useDefault: boolean = true
	): { relativeUrl: string; url: string } => {
		const sectionId = _.get(sectionIdentifier, 'sectionId')
		const appDefinitionId = _.get(sectionIdentifier, 'appDefinitionId')

		if (!sectionId || !appDefinitionId) {
			throw new Error(`getSectionUrl, invalid input. sectionId: ${sectionId} appDefinitionId: ${appDefinitionId}`)
		}
		let page: PageData | undefined

		const appPages = _.filter(pages, { applicationId: appDefinitionId })
		page = _.find(appPages, { tpaPageId: sectionId })
		if (!page && useDefault) {
			page = appPages[0]
		}

		return page ? { url: `${baseUrl}${page.url}`, relativeUrl: page.url } : { url: '', relativeUrl: '' }
	}

	const removeIdField = <T extends object>(items: Array<T>): Array<Omit<T, 'id'>> =>
		items.map((item: T) => _.omit(item, ['id']) as Omit<T, 'id'>)

	return {
		[namespace]: {
			revision: `${siteRevision}`,
			regionalSettings,
			language,
			getAppToken: (appDefinitionId) => {
				const instance = platformUtils.sessionServiceApi.getInstance(appDefinitionId)
				if (!instance) {
					logSdkError(`App with appDefinitionId ${appDefinitionId} does not exist on the site`)
				}
				return instance
			},
			getSiteStructure: (options) => {
				const includePageId = options?.includePageId
				const prefixes = [..._.values(appPrefixes), ..._.values(routerPrefixes)]
				if (experiments['specs.thunderbolt.GetSiteStructurePreventAutoPageIdRetrieval']) {
					return {
						lightboxes: includePageId ? lightboxes : removeIdField(lightboxes),
						pages: includePageId ? structurePagesData : removeIdField(structurePagesData),
						prefixes,
					}
				}
				return {
					lightboxes,
					pages: structurePagesData,
					prefixes,
				}
			},
			getSectionUrl,
			loadNewSession: () => platformUtils.sessionServiceApi.loadNewSession(),
			onInstanceChanged: (callback: OnInstanceChangedCallback, appDefinitionId: string) => {
				platformUtils.sessionServiceApi.onInstanceChanged(callback, appDefinitionId)
			},
			isAppSectionInstalled: (sectionIdentifier) => {
				const { url, relativeUrl } = getSectionUrl(sectionIdentifier, false)
				return !(url === '' && relativeUrl === '')
			},
			get currentPage() {
				if (isLightbox) {
					const lightbox = pagesData[currentPageId]
					return { name: lightbox.title, type: 'lightbox' as const }
				}

				return _.find(structurePagesData, { id: currentPageId })!
			},
			timezone,
			currency,
			getPublicAPI: platformUtils.appsPublicApisUtils.getPublicAPI,
			getUrlSegments: _.noop,
			routerSitemap: async (routerPrefix) => {
				const fetchParams = await handlers.getSitemapFetchParams(routerPrefix)

				if (!fetchParams) {
					return Promise.reject('no such route')
				}

				const { url, options } = fetchParams
				const response = await fetch(url, options)
				if (!response.ok) {
					throw response
				}

				const { result } = await response.json()
				return result
			},
			prefetchPageResources: _.noop,
		},
	}
}

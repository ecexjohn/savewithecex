import { IRoutingConfig, Route, CandidateRouteInfo } from './types'
import { queryParamsWhitelist } from './queryParamsWhitelist'
import { resolveQueryParams, removeProtocol, replaceProtocol } from './urlUtils'

const getRelativePathname = (url: string, baseUrl: string): string => {
	const parsedUrl = new URL(url, `${baseUrl}/`)
	const parsedBaseUrl = new URL(baseUrl)

	return parsedUrl.pathname.replace(parsedBaseUrl.pathname, '')
}

const removeLeadingAndTrailingSlash = (str: string): string => /^\/?(.*?)\/?$/.exec(str)![1]

const getRelativePathnameParts = (relativePathname: string) => {
	const cleanPath = removeLeadingAndTrailingSlash(relativePathname)

	try {
		return decodeURI(cleanPath).split('/')
	} catch (e) {
		return cleanPath.split('/')
	}
}

const pathnamePartsToRelativeUrl = (pathnameParts: Array<string>): string => `./${pathnameParts.join('/')}`

const isInternalUrl = (url: string, baseUrl: string): boolean => {
	const parsedUrl = new URL(url, `${baseUrl}/`)
	const parsedBaseUrl = new URL(baseUrl)
	return parsedUrl.host === parsedBaseUrl.host && parsedUrl.pathname.startsWith(parsedBaseUrl.pathname)
}

const getRelativeUrlData = (
	url: string,
	baseUrl: string
): {
	relativePathnameParts: Array<string>
	relativeUrl: string
} => {
	const relativePathname = getRelativePathname(url, baseUrl)
	const relativePathnameParts = getRelativePathnameParts(relativePathname)
	const relativeUrl = pathnamePartsToRelativeUrl(relativePathnameParts)

	return {
		relativePathnameParts,
		relativeUrl,
	}
}

export const getRelativeUrl = (url: string, baseUrl: string) => getRelativeUrlData(url, baseUrl).relativeUrl

const getRouteData = (relativePathnameParts: Array<string>, routes: IRoutingConfig['routes']): Route | undefined => {
	const routeKey = `./${relativePathnameParts[0]}`

	return routes[routeKey]
}

const keepInternalQueryParams = (currentQueryParams: string) => {
	const currentRouteInfoQueryParams = new URLSearchParams(currentQueryParams)
	const { names, matchers } = queryParamsWhitelist
	currentRouteInfoQueryParams.forEach((value: any, key: any) => {
		if (!(names.has(key) || matchers.some((matcher) => key.match(matcher)))) {
			currentRouteInfoQueryParams.delete(key)
		}
	})

	return currentRouteInfoQueryParams.toString()
}

const isUrlOnSameWixSite = (candidateUrl: string, baseUrl: string) => {
	const candidateUrlWithNoProtocol = removeProtocol(candidateUrl)
	const baseUrlWithNoProtocol = removeProtocol(baseUrl)

	return candidateUrlWithNoProtocol.startsWith(baseUrlWithNoProtocol)
}

export const resolveUrl = (
	url: string,
	routingConfig: IRoutingConfig,
	currentParsedUrl?: URL
): Partial<CandidateRouteInfo> => {
	const isHomePageUrl = url === './'
	const queryParams = currentParsedUrl ? keepInternalQueryParams(currentParsedUrl.search) : ''

	// should resolve to base url on home page url, otherwise we get extra slash on navigation
	const candidateUrl = isHomePageUrl ? routingConfig.baseUrl : url
	const urlToParse = isUrlOnSameWixSite(candidateUrl, routingConfig.baseUrl)
		? replaceProtocol(candidateUrl, new URL(routingConfig.baseUrl).protocol)
		: candidateUrl

	const parsedUrl = new URL(urlToParse, `${routingConfig.baseUrl}/`)
	parsedUrl.search = resolveQueryParams(parsedUrl.search, queryParams)

	if (!isInternalUrl(urlToParse, routingConfig.baseUrl)) {
		return {
			parsedUrl,
		}
	}

	const { relativeUrl, relativePathnameParts } = getRelativeUrlData(urlToParse, routingConfig.baseUrl)
	const route = getRouteData(relativePathnameParts, routingConfig.routes)

	return {
		...route,
		relativeUrl,
		parsedUrl,
	}
}

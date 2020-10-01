import _ from 'lodash'
import { PlatformEnvData, PlatformUtils } from '@wix/thunderbolt-symbols'
import {
	namespace,
	LocationWixCodeSdkHandlers,
	LocationWixCodeSdkWixCodeApi,
	LocationOnChangeHandler,
	LocationWixCodeSdkFactoryData,
} from '..'
import { getDecodedUrlObject, logSdkError } from '@wix/thunderbolt-commons'
import { ExternalLinkData } from '@wix/thunderbolt-becky-types'

/**
 * This is SDK Factory.
 * Expose your Corvid API
 */
export function LocationSdkFactory(
	{ baseUrl, routersConfigMap }: LocationWixCodeSdkFactoryData,
	{ navigateTo, pushUrlState, registerLocationSdkOnChangeHandler }: LocationWixCodeSdkHandlers,
	{ linkUtils }: PlatformUtils,
	platformEnvData: PlatformEnvData
): { [namespace]: LocationWixCodeSdkWixCodeApi } {
	let urlObj = platformEnvData.url
	const isFreeSite = baseUrl.indexOf('wixsite.com') > 0

	const getFullPath = () => {
		const pathAsArray = urlObj.pathname.substring(1).split('/')
		return isFreeSite ? pathAsArray.slice(1) : pathAsArray
	}

	const routerData = getFullPath()[0] && _.find(routersConfigMap, { prefix: getFullPath()[0] })
	const prefix = routerData && routerData.prefix

	const getPath = () => {
		const fullPath = getFullPath()
		return prefix && fullPath[0] === prefix ? fullPath.slice(1) : fullPath
	}

	const to = (href: string) => {
		const linkProps = linkUtils.getLinkProps(href)
		if (linkUtils.isAbsoluteUrl(href)) {
			linkProps.target = '_self'
		}

		navigateTo(linkProps)
	}

	const searchParams: Record<string, Array<string> | string> = {}
	const sp = urlObj.searchParams
	// @ts-ignore
	for (const key of sp.keys()) {
		const paramValues = sp.getAll(key)
		searchParams[key] = paramValues.length > 1 ? paramValues : paramValues[0]
	}

	const onChangeHandlers: Array<LocationOnChangeHandler> = []
	const onChangeManager = (href: string) => {
		urlObj = getDecodedUrlObject(href)
		onChangeHandlers.forEach((handler) => handler({ path: getPath() }))
	}

	if (process.env.browser) {
		registerLocationSdkOnChangeHandler(onChangeManager)
	}

	return {
		[namespace]: {
			get url() {
				return urlObj.href
			},
			baseUrl,
			get path() {
				return getPath()
			},
			prefix,
			protocol: urlObj.protocol.slice(0, -1),
			query: searchParams,
			queryParams: {
				add: (toAdd) => {
					Object.keys(toAdd).forEach((key) => {
						urlObj.searchParams.set(key, toAdd[key])
						searchParams[key] = toAdd[key] // update searchParams closure
					})
					pushUrlState(urlObj.href)
				},
				remove: (toRemove) => {
					toRemove.forEach((key) => {
						urlObj.searchParams.delete(key)
						delete searchParams[key] // update searchParams closure
					})
					pushUrlState(urlObj.href)
				},
			},
			onChange: (handler: LocationOnChangeHandler) => {
				onChangeHandlers.push(handler)
			},
			getExternalUrl: (linkData) => (linkData?.type === 'ExternalLink' ? linkData.url : null),
			navigateTo: (linkData) => {
				const linkType = linkData.type
				if (linkType === 'ExternalLink') {
					logSdkError(
						`The "navigateTo" method has not been executed for linkData with url: ${
							(linkData as ExternalLinkData).url
						}. You can get the external url value by using the "getExternalUrl" method`
					)
					return
				}

				const href = linkUtils.getLinkUrlFromDataItem(linkData)
				return to(href)
			},
			to,
			buildUrl: _.noop,
		},
	}
}

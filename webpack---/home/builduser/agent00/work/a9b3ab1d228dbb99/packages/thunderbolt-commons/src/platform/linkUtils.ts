import { escape, invert } from 'lodash'
import { LinkUtils, LinkUtilsConfig } from '@wix/thunderbolt-symbols'
import {
	AnchorLinkData,
	EmailLinkData,
	PhoneLinkData,
	PageLinkData,
	DocumentLinkData,
	ExternalLinkData,
	LinkProps,
	DynamicPageLinkData,
} from '@wix/thunderbolt-becky-types'
import { resolveEmailLink, resolvePhoneLink, resolveDocumentLink, resolveExternalLinkRel } from '../links'

const PAGE_URL_REGEXP = /^\/([^ ?#]*)?[#]?([^ ?#]*)[?]?(.*)/
const SAME_PAGE_WITH_ANCHOR_REGEXP = /^#([^ ?]*)[?]?(.*)/
const PHONE_URL_REGEXP = /^tel:(.*)/
const MAILTO_URL_REGEXP = /^mailto:([^?]*)(?:\?subject=(.*)?)?/
const ABSOLUTE_URL_REGEXP = /^(http|https):\/\/(.*)/
const DOCUMENT_URL_REGEXP = /^wix:document:\/\/v1\/(.+)\/(.+)/
const LEGACY_DOCUMENT_URL_REGEXP = /^document:\/\/(.*)/

const ANCHOR_NAME_TO_TYPE: Record<string, string> = {
	top: 'SCROLL_TO_TOP',
	bottom: 'SCROLL_TO_BOTTOM',
}

type LinkPropsFactory = (url: string, target?: LinkProps['target']) => LinkProps

const isPhoneUrl = (url: string) => PHONE_URL_REGEXP.test(url)
const getPhoneLinkProps: LinkPropsFactory = (telUrl) => {
	const [, phoneNumber] = PHONE_URL_REGEXP.exec(telUrl)!
	return {
		href: resolvePhoneLink({ phoneNumber }),
		target: '_self',
	}
}

const isMailtoUrl = (url: string) => MAILTO_URL_REGEXP.test(url)
const getMailtoLinkProps: LinkPropsFactory = (mailtoUrl) => {
	const [, recipient, subject] = MAILTO_URL_REGEXP.exec(mailtoUrl)!

	const escapedRecipient = escape(recipient)
	const escapedSubject = escape(subject)

	return {
		href: resolveEmailLink({ recipient: escapedRecipient, subject: escapedSubject }),
		target: '_self',
	}
}

const isDocumentUrl = (url: string) => DOCUMENT_URL_REGEXP.test(url) || LEGACY_DOCUMENT_URL_REGEXP.test(url)

const isAbsoluteUrl = (url: string) => ABSOLUTE_URL_REGEXP.test(url)

const isPageUrl = (href: string) => PAGE_URL_REGEXP.test(href)

const isSamePageAnchorUrl = (href: string) => SAME_PAGE_WITH_ANCHOR_REGEXP.test(href)

const isDynamicPage = (routersConfig: LinkUtilsConfig['routersConfig'], pageUriSeo: string) => {
	if (routersConfig) {
		const [prefix] = pageUriSeo.replace('#', '/#').split(/[/]+/)
		const routersWithPrefixFromUrl = Object.values(routersConfig).filter((router) => router.prefix === prefix)
		return routersWithPrefixFromUrl.length === 1
	}

	return false
}

const getPageRoute = (routingInfo: LinkUtilsConfig['routingInfo'], pageId: string): string => {
	const pageRoutes = Object.keys(routingInfo.routes)
	const pageRoute = pageRoutes.find((key) => routingInfo.routes[key].pageId === pageId)

	if (pageRoute) {
		return pageRoute.replace(/^\.\//, '/')
	}

	throw new Error(`No url route for pageId: ${pageId}`)
}

class UnsupportedLinkTypeError extends Error {
	constructor() {
		super('Unsupported link type')
		this.name = 'UnsupportedLinkTypeError'

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UnsupportedLinkTypeError)
		}
	}
}

export const isLinkProps = (linkProps: any): linkProps is LinkProps =>
	!linkProps.type && !!(linkProps.href || linkProps.linkPopupId || linkProps.anchorDataId || linkProps.anchorCompId)

const removeLeadingDotFromRoute = (url: string) => url.replace(/\.\//, '/')

const isScrollTopOrBottomAnchor = (anchorDataId: string) => ['SCROLL_TO_TOP', 'SCROLL_TO_BOTTOM'].includes(anchorDataId)

export const createLinkUtils = ({
	routingInfo,
	metaSiteId,
	userFileDomainUrl,
	isPremiumDomain,
	popupPages,
	getCompIdByWixCodeNickname,
	getRoleForCompId,
	routersConfig,
}: LinkUtilsConfig): LinkUtils => {
	const BASE_DOCUMENTS_URL = `https://${metaSiteId}.${userFileDomainUrl}/`

	const isPopupId = (pageId: string) => (popupPages ? popupPages[pageId] : false)

	const isDocumentHref = (href: string) => href.startsWith(BASE_DOCUMENTS_URL)
	const getDocumentLink = (documentHref: string) => {
		const link = documentHref
			.replace(BASE_DOCUMENTS_URL, '')
			.replace('ugd/', '')
			.replace('?dn=', '/')
			.replace('?indexable=true', '')

		return `wix:document://v1/${link}`
	}

	const getDocumentLinkProps: LinkPropsFactory = (documentUrl): LinkProps => {
		const [, docId, name] = DOCUMENT_URL_REGEXP.exec(documentUrl) || LEGACY_DOCUMENT_URL_REGEXP.exec(documentUrl)!

		return {
			href: resolveDocumentLink({ docId, name: name || '', indexable: false }, metaSiteId, userFileDomainUrl),
			target: '_blank',
		}
	}

	const getExternalLinkProps: LinkPropsFactory = (url, target = '_blank'): LinkProps => {
		return {
			href: url,
			target,
			rel: resolveExternalLinkRel({ target, isPremiumDomain }),
		}
	}

	const parsePageUrl = (url: string) => {
		const [, relativePageUrlPrefix = '', anchor = '', queryString = ''] = PAGE_URL_REGEXP.exec(url)!
		return { relativePageUrlPrefix, anchor, queryString }
	}

	const isDynamicPageUrl = (url: string) => {
		const { relativePageUrlPrefix } = parsePageUrl(url)
		return isDynamicPage(routersConfig, relativePageUrlPrefix)
	}

	const getHomePageRouteWithPageUriSEO = () => {
		const [route] = Object.keys(
			Object.fromEntries(
				Object.entries(routingInfo.routes).filter(
					([key, value]) => value.pageId === routingInfo.mainPageId && key !== './'
				)
			)
		)
		return route
	}

	const getPageLinkProps: LinkPropsFactory = (pageUrl, target = '_self') => {
		const { relativePageUrlPrefix = '', anchor = '', queryString } = parsePageUrl(pageUrl)
		const anchorNickname = ANCHOR_NAME_TO_TYPE[anchor] || anchor

		if (isPopupId(relativePageUrlPrefix)) {
			return {
				// eslint-disable-next-line no-script-url
				href: 'javascript:void()',
				target: '_self',
				linkPopupId: relativePageUrlPrefix,
			}
		}

		let href
		let isSamePageNavigation
		if (isDynamicPage(routersConfig, relativePageUrlPrefix)) {
			href = `./${relativePageUrlPrefix}`
			isSamePageNavigation = href === routingInfo.relativeUrl
		} else {
			// Page route / TPA page route with inner route(s)
			const [pageUriSeo, ...tpaInnerRoute] = relativePageUrlPrefix.split('/')
			const tpaInnerRoutePath = tpaInnerRoute.length > 0 ? `/${tpaInnerRoute.join('/')}` : ''

			const pageUriSeoWithLowerCase = pageUriSeo.toLowerCase()
			const pageRoute = `./${pageUriSeoWithLowerCase}`
			const nextRouteConfig = routingInfo.routes[pageRoute]
			const isHomePageNavigation = !nextRouteConfig || nextRouteConfig.pageId === routingInfo.mainPageId

			href =
				isHomePageNavigation && !tpaInnerRoutePath ? `./` : `./${pageUriSeoWithLowerCase}${tpaInnerRoutePath}`

			isSamePageNavigation = nextRouteConfig && nextRouteConfig.pageId === routingInfo.pageId
		}

		const anchorCompId = anchorNickname && getCompIdByWixCodeNickname && getCompIdByWixCodeNickname(anchorNickname)
		const hasAnchorOnSamePage = isSamePageNavigation && anchorCompId
		const hasAnchorOnOtherPage = anchorNickname && !hasAnchorOnSamePage

		return {
			href: `${href}${queryString ? `?${queryString}` : ''}`,
			target,
			// if we have an anchor on the current page, we set the anchor compId
			...(hasAnchorOnSamePage && { anchorCompId }),
			// if we have an anchor on another page, we set the anchor data item Id
			...(hasAnchorOnOtherPage && { anchorDataId: anchorNickname }),
		}
	}

	return {
		isAbsoluteUrl,
		isDynamicPage: isDynamicPageUrl,
		getLink: ({ href = '', linkPopupId, anchorCompId = '', anchorDataId = '' } = {}) => {
			if (linkPopupId) {
				return `/${linkPopupId}`
			}

			if (isDocumentHref(href)) {
				return getDocumentLink(href)
			}

			if (isScrollTopOrBottomAnchor(anchorDataId)) {
				return `#${invert(ANCHOR_NAME_TO_TYPE)[anchorDataId]}`
			}

			const anchor = getRoleForCompId?.(anchorCompId, 'wixCode') || anchorDataId
			const anchorId = anchor ? `#${anchor}` : ''
			const hrefWithPageUriSEO = href === './' ? getHomePageRouteWithPageUriSEO() : href
			const link = removeLeadingDotFromRoute(hrefWithPageUriSEO)

			return `${link}${anchorId}`
		},
		getLinkProps: (url, target) => {
			if (isSamePageAnchorUrl(url)) {
				const relativeUrl = removeLeadingDotFromRoute(routingInfo.relativeUrl)
				const currentPageUriSEOWithAnchorUrl = `${relativeUrl}${url}`
				return getPageLinkProps(currentPageUriSEOWithAnchorUrl, target)
			}

			if (isPageUrl(url)) {
				return getPageLinkProps(url, target)
			}

			if (isMailtoUrl(url)) {
				return getMailtoLinkProps(url)
			}

			if (isPhoneUrl(url)) {
				return getPhoneLinkProps(url)
			}

			if (isAbsoluteUrl(url)) {
				return getExternalLinkProps(url, target)
			}

			if (isDocumentUrl(url)) {
				return getDocumentLinkProps(url)
			}

			throw new UnsupportedLinkTypeError()
		},
		getLinkUrlFromDataItem: (linkData) => {
			const linkTypeToUrlResolverFn: Record<string, () => string> = {
				AnchorLink: () => {
					const { anchorDataId, pageId } = linkData as AnchorLinkData
					const isScrollTopOrBottom = isScrollTopOrBottomAnchor(anchorDataId)
					const nextPageId = isScrollTopOrBottom ? routingInfo.pageId : pageId.replace(/^#/, '')
					const nextAnchorDataId = isScrollTopOrBottom ? `#${anchorDataId}` : anchorDataId

					// get page route for current page id for top/bottom anchors, otherwise get route for pageId from data item
					const pageRoute = getPageRoute(routingInfo, nextPageId)
					return `${pageRoute}${nextAnchorDataId}`
				},
				DocumentLink: () => {
					const { docId, name } = linkData as DocumentLinkData
					return `wix:document://v1/${docId}/${name}`
				},
				ExternalLink: () => {
					const { url } = linkData as ExternalLinkData
					return url
				},
				DynamicPageLink: () => {
					const { routerId, innerRoute, anchorDataId = '', isTpaRoute } = linkData as DynamicPageLinkData
					const prefix = isTpaRoute
						? getPageRoute(routingInfo, routerId)
						: `/${routersConfig![routerId].prefix}`

					const suffix = innerRoute ? `/${innerRoute}${anchorDataId}` : anchorDataId
					return `${prefix}${suffix}`
				},
				PageLink: () => {
					const { pageId: pageIdOrData } = linkData as PageLinkData
					const pageId = ((pageIdOrData as { id: string }).id || (pageIdOrData as string) || '').replace(
						/^#/,
						''
					)
					if (isPopupId(pageId)) {
						return `/${pageId}`
					}

					if (pageId === routingInfo.mainPageId) {
						return '/'
					}

					return getPageRoute(routingInfo, pageId)
				},
				PhoneLink: () => resolvePhoneLink(linkData as PhoneLinkData),
				EmailLink: () => resolveEmailLink(linkData as EmailLinkData),
			}

			const linkUrlResolverFn = linkTypeToUrlResolverFn[linkData.type]
			if (linkUrlResolverFn) {
				return linkUrlResolverFn()
			}

			throw new Error('Provided link type is not supported')
		},
	}
}

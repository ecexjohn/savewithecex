import {
	findFirstMatch,
	MatchingResult,
	PatternType,
	replaceEmails,
	replacePhoneNumbers,
	replaceUrls,
} from './textPatterns'
import {
	LinkProps,
	PhoneLinkData,
	EmailLinkData,
	DocumentLinkData,
	DynamicPageLinkData,
	WhatsAppLinkData,
	AddressLinkData,
	PageLinkData,
} from '@wix/thunderbolt-becky-types'
import { RoutersConfigMap } from '@wix/thunderbolt-ssr-api'

const PatternToPrefix: { [key in keyof typeof PatternType]: string } = {
	[PatternType.PHONE]: 'tel:',
	[PatternType.MAIL]: 'mailto:',
	[PatternType.URL]: '',
}

const parseLinkValue = ({ pattern, value }: MatchingResult): LinkProps => {
	const baseLinkProps = pattern === PatternType.URL ? ({ target: '_blank' } as const) : {}
	return { ...baseLinkProps, href: `${PatternToPrefix[pattern]}${value}` }
}

const getPropertyName = (key: string) => {
	switch (key) {
		case 'linkPopupId':
			return 'data-popupid'
		case 'anchorDataId':
			return 'data-anchor'
		case 'anchorCompId':
			return 'data-anchor-comp-id'
		default:
			return key
	}
}

export const toQueryString = (queryObject: Record<string, string>) =>
	Object.keys(queryObject)
		.map((key) => `${key}=${encodeURIComponent(queryObject[key])}`)
		.join('&')

const getLinkAttributes = (linkProps?: LinkProps): string =>
	linkProps
		? Object.keys(linkProps)
				.map((key) => `${getPropertyName(key)}="${linkProps[key as keyof LinkProps]}"`)
				.join(' ')
		: ''

const joinAttributesParts = (attributesParts: Array<string>): string =>
	attributesParts
		.filter((attributesPart) => attributesPart !== '')
		.map((attributesPart) => attributesPart.trim())
		.join(' ')

export const convertDataQueryLinksToHtmlAnchors = (text: string, linkList: Record<string, LinkProps>) =>
	text.replace(/<a ([^>]*)dataquery="#([^"]+)"([^>]*)>/g, (_full, preAttributes, dataQuery, postAttributes) => {
		const linkProps = linkList[dataQuery]
		const fixedAttributes = joinAttributesParts([preAttributes, getLinkAttributes(linkProps), postAttributes])
		return `<a${fixedAttributes ? ` ${fixedAttributes}` : ''}>`
	})

export const getImpliedLink = (text: string, isMobileView: boolean): LinkProps | null => {
	const firstMatch = findFirstMatch(text, { MAIL: true, URL: true, PHONE: isMobileView })
	return firstMatch && parseLinkValue(firstMatch)
}

const getLinkWrapperFunction = (type: 'email' | 'url' | 'phone') => (content: string) => {
	let aTagContent: string = ''
	const href = content.trim()
	switch (type) {
		case 'email':
			aTagContent = `href="mailto:${href}"`
			break
		case 'phone':
			aTagContent = `href="tel:${href}"`
			break
		case 'url':
			aTagContent = `href="${href}" target="_blank"`
			break
		default:
	}
	return `<object height="0"><a ${aTagContent}>${content}</a></object>`
}

const wrapEmailImpliedLink = getLinkWrapperFunction('email')
const wrapUrlImpliedLink = getLinkWrapperFunction('url')
const wrapPhoneImpliedLink = getLinkWrapperFunction('phone')

const getTextLinkMatcher = (isMobileView: boolean) => (fullMatch: string, text?: string) => {
	if (!text) {
		return fullMatch
	}
	let textWithLinks = replaceEmails(text, wrapEmailImpliedLink)
	textWithLinks = replaceUrls(textWithLinks, wrapUrlImpliedLink)
	if (isMobileView) {
		textWithLinks = replacePhoneNumbers(textWithLinks, wrapPhoneImpliedLink)
	}

	return fullMatch.split(text).join(textWithLinks)
}

export function getImpliedLinks(text: string, isMobileView: boolean) {
	/**
	 * >((?![<>]).+?)< - Lazly search for any text within '>' '<' to extract text nodes
	 * (?:<a.*>.*<\/a>) - Match all inside `a` tags (inclusive), without adding to the capture group
	 * The result - getting only the text, excluding any text/nodes within `a` tags.
	 */
	return text.replace(/>((?![<>]).+?)<|(?:<a.*>.*<\/a>)/g, getTextLinkMatcher(isMobileView))
}

export const getPostSignupUrl = (postSignupUrl: string): string => {
	const placeholder = '{ifcontext}'
	if (!postSignupUrl.includes(placeholder)) {
		return postSignupUrl
	}

	const [, queryString] = postSignupUrl.split('?')
	const urlSearchParams = new URLSearchParams(queryString)

	let target
	let postSignupUrlWithContext = ''
	urlSearchParams.forEach((value, key) => {
		if (key.toLowerCase() !== 'ifcontext') {
			return
		}

		target = value.replace('#', '')
		if (/^[a-zA-Z0-9]+$/.test(target)) {
			postSignupUrlWithContext = postSignupUrl.replace(placeholder, target)
		} else {
			postSignupUrlWithContext = postSignupUrl.replace(placeholder, 'illegalContextValue')
		}
	})

	return postSignupUrlWithContext || postSignupUrl
}

export const resolveEmailLink = ({ recipient, subject, body }: Omit<EmailLinkData, 'type'>): string => {
	const queryObject: Pick<EmailLinkData, 'subject' | 'body'> = { ...(subject && { subject }), ...(body && { body }) }
	const queryString = (Object.keys(queryObject) as Array<keyof typeof queryObject>)
		.map((key) => `${key}=${queryObject[key]}`)
		.join('&')
	const query = queryString.length > 0 ? `?${queryString}` : ''
	return `mailto:${recipient}${query}`
}

export const resolveExternalLinkRel = ({
	target,
	isPremiumDomain,
}: {
	target: LinkProps['target']
	isPremiumDomain: boolean
}): string => {
	const rel = []
	if (!isPremiumDomain) {
		rel.push('nofollow')
	}

	if (target === '_blank') {
		rel.push('noopener')
	}

	return rel.join(' ')
}

export const resolvePhoneLink = ({ phoneNumber }: Omit<PhoneLinkData, 'type'>): string => `tel:${phoneNumber}`

export const resolveWhatsAppLink = ({ phoneNumber }: Omit<WhatsAppLinkData, 'type'>): string => {
	const sanitizedPhoneNumber = phoneNumber.replace(new RegExp('[+|-]', 'g'), '')
	return `https://api.whatsapp.com/send?phone=${sanitizedPhoneNumber}`
}

export const resolveAddressLink = ({ address }: Omit<AddressLinkData, 'type'>): string =>
	`http://maps.google.com/maps?daddr=${encodeURI(address)}`

const getInnerRouteSuffix = (innerRoute?: string) => innerRoute && innerRoute.replace(/^\//, '')

export const resolveDynamicPageLink = (
	{ innerRoute }: Omit<DynamicPageLinkData, 'type'>,
	routerInfo: RoutersConfigMap['string']
): string => {
	const { prefix } = routerInfo

	const innerRouteSuffix = getInnerRouteSuffix(innerRoute)
	return innerRouteSuffix ? `./${prefix}/${innerRouteSuffix}` : `./${prefix}`
}

export const resolveDynamicPageLinkTpaRoute = (
	{ innerRoute, isTpaRoute }: Omit<DynamicPageLinkData, 'type'>,
	mainPageId: string,
	pageData?: Exclude<PageLinkData['pageId'], string>
) => {
	if (!isTpaRoute || !pageData) {
		return null
	}

	const { id, pageUriSEO } = pageData
	const innerRouteSuffix = getInnerRouteSuffix(innerRoute)
	if (innerRouteSuffix) {
		return `./${pageUriSEO}/${innerRouteSuffix}`
	}

	return id === mainPageId ? './' : `./${pageUriSEO}`
}

export const resolveDocumentLink = (
	{ docId, name, indexable }: Omit<DocumentLinkData, 'type'>,
	metaSiteId: string,
	userFileDomainUrl: string
): string => {
	const baseUrl = `https://${metaSiteId}.${userFileDomainUrl}`

	const prefixedDocId = docId.includes('/') ? docId : `ugd/${docId}`
	const prefixedDocIdWithSlash = prefixedDocId.startsWith('/') ? prefixedDocId : `/${prefixedDocId}`

	const isPDF = docId.endsWith('.pdf')
	const suffix = isPDF ? (indexable ? '?index=true' : '') : `?${toQueryString({ dn: name })}`

	return `${baseUrl}${prefixedDocIdWithSlash}${suffix}`
}

import _ from 'lodash'
import { logSdkError } from '@wix/thunderbolt-commons'
import {
	LightboxContext,
	LightboxParentContext,
	namespace,
	WindowWixCodeSdkHandlers,
	WindowWixCodeSdkPageConfig,
	WindowWixCodeSdkSiteConfig,
} from '..'
import { PlatformEnvData, PlatformUtils, WixWindow, ScrollToOptions, OpenPopupOptions } from '@wix/thunderbolt-symbols'
import { transfer as comlinkTransfer } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax

const lightboxHandles: {
	[lightboxPageId: string]: {
		resolveOpenLightboxPromise: Function
		lightboxParentContext: LightboxParentContext
		lightboxContext: LightboxContext
	}
} = {}

export function WindowSdkFactory(
	{
		locale,
		previewMode,
		isMobileFriendly,
		isPopup,
		popupNameToPageId,
		pageId,
		formFactor,
	}: WindowWixCodeSdkSiteConfig & WindowWixCodeSdkPageConfig,
	{
		getCurrentGeolocation,
		openModal,
		openLightbox,
		closeLightbox,
		scrollToHandler,
		scrollByHandler,
		copyToClipboard,
		trackEvent,
		setCurrentLanguage,
		openTpaPopup,
		getBoundingRectHandler,
		postMessageHandler,
	}: WindowWixCodeSdkHandlers,
	platformUtils: PlatformUtils,
	platformEnvData: PlatformEnvData
): { [namespace]: WixWindow } {
	const multilingual = platformEnvData.multilingual
	const { isSSR, browserLocale } = platformEnvData.window
	const { referrer } = platformEnvData.document

	function validate(value: number | object | undefined, param: string, type: string) {
		if (typeof value !== type) {
			return {
				param,
				value,
				expectedType: type,
			}
		}
	}

	function _openLightbox(lightboxName: string, lightboxParentContext?: LightboxParentContext) {
		if (isSSR) {
			return Promise.resolve()
		}

		return new Promise((resolve, reject) => {
			if (!_.isString(lightboxName)) {
				return reject('Lightbox title is not a valid input')
			}
			if (!popupNameToPageId[lightboxName]) {
				return reject(`There is no lightbox with the title "${lightboxName}".`)
			}

			const lightboxPageId = popupNameToPageId[lightboxName]
			if (lightboxHandles[lightboxPageId]) {
				// prevent parkinson attack
				return reject('Lightbox is open')
			}

			lightboxHandles[lightboxPageId] = {
				resolveOpenLightboxPromise: resolve,
				lightboxParentContext,
				lightboxContext: null,
			}

			openLightbox(lightboxPageId, lightboxName, () => {
				resolve(lightboxHandles[lightboxPageId].lightboxContext)
				delete lightboxHandles[lightboxPageId]
			}).catch((err) => {
				delete lightboxHandles[lightboxPageId]
				reject(err)
			})
		})
	}

	function _closeLightBox(lightboxContext: LightboxContext) {
		if (!isPopup) {
			logSdkError('The current page is not a lightbox and therefore cannot be closed')
			return
		}
		if (lightboxHandles[pageId]) {
			// lightbox was opened via corvid
			lightboxHandles[pageId].lightboxContext = lightboxContext
		}
		closeLightbox()
	}

	function scrollTo(x: number, y: number, options?: ScrollToOptions) {
		if (isSSR) {
			return Promise.resolve()
		}

		return new Promise((resolve, reject) => {
			let validationErrorInfo = validate(x, 'x', 'number')
			if (!validationErrorInfo) {
				validationErrorInfo = validate(y, 'y', 'number')
			}
			if (!validationErrorInfo && options) {
				validationErrorInfo = validate(options, 'options', 'object')
			}
			if (validationErrorInfo) {
				const { param, value, expectedType } = validationErrorInfo
				logSdkError(
					`The ${param} parameter that is passed to the scrollTo method cannot be set to the value ${value}. It must be of type ${expectedType}.`
				)
				reject({})
				return
			}

			const shouldAnimate = options?.scrollAnimation !== false
			scrollToHandler(x, y, shouldAnimate).then(resolve)
		})
	}

	function scrollBy(x: number, y: number) {
		if (isSSR) {
			return Promise.resolve()
		}

		return new Promise((resolve, reject) => {
			let validationErrorInfo = validate(x, 'x', 'number')
			if (!validationErrorInfo) {
				validationErrorInfo = validate(y, 'y', 'number')
			}
			if (validationErrorInfo) {
				const { param, value, expectedType } = validationErrorInfo
				logSdkError(
					`The ${param} parameter that is passed to the scrollBy method cannot be set to the value ${value}. It must be of type ${expectedType}.`
				)
				reject({})
				return
			}

			scrollByHandler(x, y).then(resolve)
		})
	}

	const _copyToClipboard = (text: string) => {
		if (isSSR) {
			return Promise.resolve()
		}
		if (!text) {
			return Promise.reject({ error: 'unable to copy null value' })
		}
		return copyToClipboard(text)
	}

	const _openTpaPopup = (url: string, options: OpenPopupOptions, compId: string, persistent: boolean) => {
		if (isSSR) {
			return Promise.resolve()
		}

		return openTpaPopup(
			url,
			{
				..._.defaults(options, { position: { origin: 'FIXED', placement: 'CENTER' } }),
				persistent,
			},
			compId
		)
	}

	function getBoundingRect() {
		if (isSSR) {
			return null
		}

		return getBoundingRectHandler()
	}

	return {
		[namespace]: {
			getComponentViewportState: () =>
				Promise.resolve({
					// TODO: remove this once proGallery is in TB https://jira.wixpress.com/browse/PLAT-526
					in: true,
				}),
			multilingual: {
				siteLanguages: multilingual?.siteLanguages || [],
				isEnabled: !!multilingual,
				get currentLanguage() {
					return multilingual?.currentLanguage?.languageCode || ''
				},
				set currentLanguage(languageCode: string) {
					setCurrentLanguage(languageCode)
				},
			},
			browserLocale,
			formFactor,
			locale,
			referrer,
			viewMode: previewMode ? 'Preview' : 'Site',
			getCurrentGeolocation,
			rendering: {
				env: isSSR ? 'backend' : 'browser',
				renderCycle: 0, // TODO
				warmupData: {}, // TODO
			},
			openModal: isSSR ? () => Promise.resolve() : openModal,
			openLightbox: _openLightbox,
			lightbox: {
				getContext: () => (lightboxHandles[pageId] || {}).lightboxParentContext,
				close: _closeLightBox,
			},
			copyToClipboard: _copyToClipboard,
			scrollTo,
			scrollBy,
			trackEvent: isSSR ? () => Promise.resolve() : trackEvent,
			openPopup: (url: string, options: OpenPopupOptions, compId: string) =>
				_openTpaPopup(url, options, compId, false),
			openPersistentPopup: (url: string, options: OpenPopupOptions, compId: string) =>
				_openTpaPopup(url, options, compId, true),
			isMobileFriendly,
			getBoundingRect,
			postMessage(message: any, target?: string, targetOrigin?: string, transfer?: Array<any>) {
				if (isSSR) {
					console.error('postMessage is not supported in SSR')
					return
				}

				if (transfer !== undefined) {
					postMessageHandler(message, target, targetOrigin, comlinkTransfer(transfer, transfer))
				} else {
					postMessageHandler(message, target, targetOrigin, undefined)
				}
			},
			getRouterData: () => _.get(platformEnvData, 'routerData.pageData', null),
		},
	}
}

import { withDependencies, optional, named } from '@wix/thunderbolt-ioc'
import { hasNavigator, isSSR } from '@wix/thunderbolt-commons'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	SdkHandlersProvider,
	ViewModeSym,
	ViewMode,
	IMultilingual,
	IStructureAPI,
	StructureAPI,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { IPopups, PopupsSymbol } from 'feature-popups'
import { IReporterApi, ReporterSymbol } from 'feature-reporter'
import { WindowWixCodeSdkHandlers, WindowWixCodeSdkSiteConfig } from '../types'
import { Animations, IAnimations } from 'feature-animations'
import { IWindowScrollAPI, WindowScrollApiSymbol } from 'feature-window-scroll'
import { MultilingualSymbol } from 'feature-multilingual'
import { TpaPopupSymbol, ITpaPopup, ITpaModal, TpaModalSymbol } from 'feature-tpa'
import { name } from '../symbols'

function setCurrentLanguage(languageCode: string): never {
	throw new Error(`language code "${languageCode}" is invalid`)
}

export const windowWixCodeSdkHandlers = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		optional(Animations),
		BrowserWindowSymbol,
		ViewModeSym,
		TpaModalSymbol,
		TpaPopupSymbol,
		StructureAPI,
		WindowScrollApiSymbol,
		optional(PopupsSymbol),
		optional(ReporterSymbol),
		optional(MultilingualSymbol),
	],
	(
		{ isResponsive }: WindowWixCodeSdkSiteConfig,
		animations: IAnimations,
		window: BrowserWindow,
		viewMode: ViewMode,
		{ openModal }: ITpaModal,
		{ openPopup }: ITpaPopup,
		structureApi: IStructureAPI,
		windowScrollApi: IWindowScrollAPI,
		popupsFeature?: IPopups,
		analyticFeature?: IReporterApi,
		multilingual?: IMultilingual
	): SdkHandlersProvider<WindowWixCodeSdkHandlers> => {
		const getCompIdFromTemplateId = (templateId: string): string => {
			// TODO this is crappy workaround until vladi's PR is merged with proper fix
			if (isResponsive) {
				return (
					Object.keys(structureApi.getEntireStore()).find((compId) =>
						new RegExp(`.+_r_${templateId}`).test(compId)
					) || templateId
				)
			}
			return templateId
		}

		return {
			getSdkHandlers: () => ({
				getBoundingRectHandler: () => {
					if (!window) {
						return null
					}
					return Promise.resolve({
						window: {
							height: window.innerHeight,
							width: window.innerWidth,
						},
						document: {
							height: document.documentElement.clientHeight,
							width: document.documentElement.clientWidth,
						},
						scroll: {
							x: window.scrollX,
							y: window.scrollY,
						},
					})
				},
				setCurrentLanguage: multilingual?.setCurrentLanguage || setCurrentLanguage,
				async scrollToComponent(compId: string, callback: Function) {
					if (!process.env.browser) {
						return
					}
					await windowScrollApi.scrollToComponent(compId)
					callback()
				},
				async scrollToHandler(x, y, shouldAnimate) {
					if (isSSR(window)) {
						return
					}
					if (!shouldAnimate) {
						window.scrollTo(x, y)
					}
					return windowScrollApi.animatedScrollTo(y)
				},
				async scrollByHandler(x, y) {
					if (isSSR(window)) {
						return
					}
					window.scrollBy(x, y)
					return new Promise((resolve) => {
						window.requestAnimationFrame(() => {
							resolve()
						})
					})
				},
				async copyToClipboard(text: string) {
					const copy = await import('copy-to-clipboard')
					copy.default(text)
				},

				getCurrentGeolocation() {
					return new Promise((resolve, reject) => {
						if (hasNavigator(window)) {
							navigator.geolocation.getCurrentPosition(resolve, ({ message, code }) => {
								reject({ message, code })
							})
						}
					})
				},
				openModal(url: string, options: any, compId?: string) {
					return openModal(url, options, compId ? getCompIdFromTemplateId(compId) : compId)
				},
				openLightbox(lightboxPageId, lightboxName, closeHandler) {
					return popupsFeature
						? popupsFeature.openPopupPage(lightboxPageId, closeHandler)
						: Promise.reject(`There is no lightbox with the title "${lightboxName}".`)
				},
				closeLightbox() {
					if (popupsFeature) {
						popupsFeature.closePopupPage()
					}
				},
				openTpaPopup(url: string, options: any, compId: string) {
					return openPopup(url, options, getCompIdFromTemplateId(compId))
				},
				trackEvent(eventName: string, params = {}, options = {}) {
					const event = { eventName, params, options }
					analyticFeature && analyticFeature.trackEvent(event)
				},
				postMessageHandler(
					message: any,
					target: string = 'parent',
					targetOrigin: string = '*',
					transfer?: Array<Transferable>
				) {
					if (!window) {
						return
					}

					if (target !== 'parent') {
						return
					}

					window.parent.postMessage(message, targetOrigin, transfer)
				},
			}),
		}
	}
)

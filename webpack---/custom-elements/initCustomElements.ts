import wixCustomElementsRegistry from 'wix-custom-elements'
import fastdom from 'fastdom'
import ResizeObserver from 'wix-resize-observer-polyfill'
import { ViewerModel } from '@wix/thunderbolt-symbols'
import { instance as biService } from '../bi-module/instance'
import { applyPolyfillsIfNeeded } from './polyfills'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'
// eslint-disable-next-line no-restricted-syntax
import mediaResizeMap from 'santa-animations/src/mediaResizeMap'

const SPEC_NAME = 'specs.thunderbolt.define_custom_elements_on_dcl'

const createDomInteractivePromise = () =>
	new Promise((resolve) => {
		const callback = () => {
			if (document.readyState === 'interactive') {
				document.removeEventListener('readystatechange', callback)
				resolve()
			}
		}
		document.addEventListener('readystatechange', callback)
	})

const getCustomElementsParams = (viewerModel: ViewerModel) => {
	const resizeService = {
		init: (callback: any) => new ResizeObserver(callback),
	}

	const windowResizeService = {
		init: (callback: any) => window.addEventListener('resize', callback),
	}

	const getDevicePixelRatio = () => {
		const isMSMobileDevice = /iemobile/i.test(navigator.userAgent)
		if (isMSMobileDevice) {
			return Math.round(
				window.screen.availWidth / (window.screen.width || window.document.documentElement.clientWidth)
			)
		}
		return window.devicePixelRatio
	}

	const isExperimentOpen = (experiment: string) => Boolean(viewerModel.experiments[experiment])

	const getMediaDimensionsByEffect = (bgEffectName: string, width: number, height: number, screenHeight: number) => {
		const { getMediaDimensions, ...rest } = mediaResizeMap[bgEffectName] || {}
		return getMediaDimensions
			? { ...getMediaDimensions(width, height, screenHeight), ...rest }
			: { width, height, ...rest }
	}

	const environmentConsts = {
		staticMediaUrl: viewerModel.media.staticMediaUrl,
		mediaRootUrl: viewerModel.media.mediaRootUrl,
		experiments: {},
		isViewerMode: true,
		devicePixelRatio: getDevicePixelRatio(),
	}

	const wixCustomElements = wixCustomElementsRegistry.init({ resizeService, windowResizeService })
	const services = {
		mutationService: fastdom,
		biService,
		isExperimentOpen,
	}
	const mediaServices = { getMediaDimensionsByEffect, ...services }

	return {
		viewerModel,
		wixCustomElements,
		services,
		environmentConsts,
		mediaServices,
	}
}

const customElementsParamsPromise = applyPolyfillsIfNeeded().then(() => getCustomElementsParams(window.viewerModel))
const domContentLoadedPromise = createDomInteractivePromise()
const shouldDefineCustomElementOnPromise = window.viewerModel.experiments[SPEC_NAME]
	? domContentLoadedPromise
	: Promise.resolve()

Promise.all([customElementsParamsPromise, shouldDefineCustomElementOnPromise]).then(
	([{ services, environmentConsts, wixCustomElements, viewerModel, mediaServices }]) => {
		wixCustomElements.defineWixImage(mediaServices, environmentConsts)
		wixCustomElements.defineWixBgImage(mediaServices, environmentConsts)
		wixCustomElements.defineWixBgMedia(mediaServices, environmentConsts)
		wixCustomElements.defineWixVideo(mediaServices, {
			...environmentConsts,
			staticVideoUrl: viewerModel.media.staticVideoUrl,
			prefersReducedMotion: prefersReducedMotion(window, viewerModel.experiments),
		})
		wixCustomElements.defineWixDropdownMenu(services, environmentConsts)
	}
)

Promise.all([customElementsParamsPromise, domContentLoadedPromise]).then(
	([{ services, environmentConsts, wixCustomElements }]) => {
		wixCustomElements.defineWixIframe(services, environmentConsts)
	}
)

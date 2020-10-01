import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import { Animations, IAnimations } from 'feature-animations'
import { IResolvableReadyForScrollPromise, IWindowScrollAPI } from './types'
import { calcScrollDuration } from './scrollUtils'
import { BrowserWindowSymbol, ViewMode, ViewModeSym, pageIdSym } from '@wix/thunderbolt-symbols'
import { PopupsSymbol, IPopups } from 'feature-popups'
import { ResolvableReadyForScrollPromiseSymbol } from './symbols'

const getCompClientYForScroll = (window: Window, compId: string) => {
	const wixAdsElement = window.document.getElementById('WIX_ADS')
	const wixAdsHeight = wixAdsElement ? wixAdsElement.offsetHeight : 0
	const siteHeaderPlaceholderElement = window.document.getElementById('SITE_HEADER-placeholder')
	const siteHeaderPlaceholderHeight = siteHeaderPlaceholderElement ? siteHeaderPlaceholderElement.offsetHeight : 0
	const bodyTop = window.document.body.getBoundingClientRect().top
	const compTop = window.document.getElementById(compId)!.getBoundingClientRect().top
	return compTop - bodyTop - wixAdsHeight - siteHeaderPlaceholderHeight
}

const getScrollableElement = (pageId: string, popupsApi?: IPopups) =>
	popupsApi?.isPopupPage(pageId) ? window.document.getElementById('POPUPS_ROOT')! : window

export const WindowScroll = withDependencies(
	[
		pageIdSym,
		BrowserWindowSymbol,
		ViewModeSym,
		ResolvableReadyForScrollPromiseSymbol,
		optional(Animations),
		optional(PopupsSymbol),
	],
	(
		pageId: string,
		window: Window,
		viewMode: ViewMode,
		{ readyForScrollPromise }: IResolvableReadyForScrollPromise,
		animations?: IAnimations,
		popupsApi?: IPopups
	): IWindowScrollAPI => {
		const animatedScrollTo = async (targetY: number): Promise<void> => {
			if (!animations) {
				return
			}
			const animationInstance = await animations.getInstance()
			await readyForScrollPromise
			const isMobile = viewMode === 'mobile'
			const easingName = isMobile ? 'Quint.easeOut' : 'Sine.easeInOut'
			const duration = calcScrollDuration(window.pageYOffset, targetY, isMobile)
			const scrollableElement = getScrollableElement(pageId, popupsApi)

			return new Promise((resolve) => {
				animationInstance.runAnimationOnElements('BaseScroll', [scrollableElement], duration, 0, {
					y: targetY,
					ease: easingName,
					callbacks: {
						onComplete: () => resolve(),
					},
				})
			})
		}

		const scrollToComponent = async (targetCompId: string) => {
			await readyForScrollPromise
			const compClientYForScroll = getCompClientYForScroll(window, targetCompId)
			await animatedScrollTo(compClientYForScroll)
			const targetElement = window.document.getElementById(targetCompId)
			// eslint-disable-next-line no-unused-expressions
			targetElement?.focus()
		}

		return {
			animatedScrollTo,
			scrollToComponent,
		}
	}
)

import { FormFactor, OOIWidgetConfig, ViewMode } from './types'
import _ from 'lodash'
import { ISiteScrollBlocker } from 'feature-site-scroll-blocker'
import { IPageScrollRegistrar } from 'feature-page-scroll'
import LazySentry from './lazySentry'

export function createHostProps({
	compData,
	pageId,
	accessibilityEnabled,
	formFactor,
	viewMode,
	siteScrollBlocker,
	registerToThrottledScroll,
	fonts,
}: {
	compData: OOIWidgetConfig
	pageId: string
	accessibilityEnabled: boolean
	formFactor: FormFactor
	viewMode: ViewMode
	siteScrollBlocker: ISiteScrollBlocker
	registerToThrottledScroll: IPageScrollRegistrar['registerToThrottledScroll']
	fonts: any
}) {
	return {
		styleId: compData.styleId,
		pageId,
		accessibilityEnabled,
		id: compData.compId,
		viewMode,
		formFactor,
		dimensions: compData.dimensions,
		isResponsive: compData.isResponsive,
		style: {
			styleParams: compData.style.style,
			siteColors: compData.style.siteColors,
			siteTextPresets: compData.style.siteTextPresets,
			fonts,
		},
		appLoadBI: {
			loaded: _.noop,
		},
		registerToComponentDidLayout: (cb: Function) => cb(),
		registerToScroll: registerToThrottledScroll,
		blockScroll: () => siteScrollBlocker.setSiteScrollingBlocked(true, compData.compId),
		unblockScroll: () => siteScrollBlocker.setSiteScrollingBlocked(false, compData.compId),
		updateLayout: _.noop,
		onSiteReady: (fn: any) => fn(),
		raven: null,
		Effect: null,
		LazySentry,
	}
}

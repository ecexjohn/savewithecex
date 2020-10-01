import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	IPropsStore,
	Props,
	PageFeatureConfigSymbol,
	ViewerModelSym,
	ViewerModel,
	SiteFeatureConfigSymbol,
	ComponentsStylesOverridesSymbol,
	IComponentsStylesOverrides,
} from '@wix/thunderbolt-symbols'
import { isSafari } from '@wix/thunderbolt-commons'
import { ITpaFullScreenMode, TpaPageConfig } from './types'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { name } from './symbols'
import { PERMITTED_FULL_SCREEN_TPAS_IN_MOBILE } from './utils/constants'
import { setFullScreenMode, removeFullScreenMode, hideSiteRoot } from './utils/tpaFullScreenUtils'

const omitBy = (obj: Record<string, string>, notAllowedKey: string) =>
	Object.keys(obj).reduce((result, cssKey) => {
		if (cssKey !== notAllowedKey) {
			result[cssKey] = obj[cssKey]
		}
		return result
	}, {} as Record<string, string>)

const fullScreenModeFactory = (
	{ widgetsClientSpecMapData, isMobileView }: TpaCommonsSiteConfig,
	{ widgets }: TpaPageConfig,
	{ deviceInfo }: ViewerModel,
	props: IPropsStore,
	window: BrowserWindow,
	componentsStylesOverrides: IComponentsStylesOverrides
): ITpaFullScreenMode => {
	const isComponentAllowedInFullScreenMode = (compId: string): boolean => {
		const widget: any = widgets[compId] || {}
		const { appDefinitionId } = widgetsClientSpecMapData[widget.widgetId] || {}
		return Object.values(PERMITTED_FULL_SCREEN_TPAS_IN_MOBILE).includes(appDefinitionId)
	}

	const enterFullScreenMode = (compId: string) => {
		setFullScreenMode(window)
		hideSiteRoot(window, true)

		props.update({
			[compId]: {
				// because any browser on iOS is safari underneath
				isSafari: isSafari(window!) || deviceInfo.os === 'IOS',
				isMobileFullScreenMode: true,
			},
			// TODO: remove. temporary solution until LAYOUT-385 is implemented
			...componentsStylesOverrides.getUpdatedStyle({
				[`${compId}-pinned-layer`]: { 'z-index': 'var(--above-all-z-index) !important' },
			}),
		})
	}

	const exitFullScreenMode = (compId: string) => {
		removeFullScreenMode(window)
		hideSiteRoot(window, false)

		// TODO: remove. temporary solution until LAYOUT-385 is implemented
		const pinnerLayerId = `${compId}-pinned-layer`
		const pinnerLayerStyle = componentsStylesOverrides.getCompStyle(pinnerLayerId)

		props.update({
			[compId]: {
				isMobileFullScreenMode: false,
			},
			...componentsStylesOverrides.getUpdatedStyle({
				[pinnerLayerId]: omitBy(pinnerLayerStyle, 'z-index'),
			}),
		})
	}

	return {
		setFullScreenMobile(compId: string, isFullScreen: boolean) {
			if (!isMobileView) {
				throw new Error('show full screen is only available in Mobile view')
			}

			if (isComponentAllowedInFullScreenMode(compId)) {
				if (isFullScreen) {
					enterFullScreenMode(compId)
				} else {
					exitFullScreenMode(compId)
				}
			}
		},
	}
}

export const TpaFullScreenMode = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, name),
		ViewerModelSym,
		Props,
		BrowserWindowSymbol,
		ComponentsStylesOverridesSymbol,
	],
	fullScreenModeFactory
)

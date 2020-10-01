import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	TpaHandlerProvider,
	Props,
	BrowserWindowSymbol,
	IPropsStore,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { computeStyleOverrides, isFullScreen, parseCssSize } from '../utils/tpaStyleOverridesBuilder'
import { ISiteScrollBlocker, SiteScrollBlockerSymbol } from 'feature-site-scroll-blocker'
import { TpaModalSymbol } from '../symbols'
import { ITpaModal, TpaPopupProps } from '../types'
import _ from 'lodash'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { runtimeTpaCompIdBuilder } from '@wix/thunderbolt-commons'

type WindowSizeDimensions = { width?: number | string; height?: number | string }

export type ResizeWindowMessageData = { width: number | string; height: number | string }
export type HeightChangedMessageData = { height: number; overflow?: boolean }

export const ResizeWindowHandler = withDependencies(
	[
		Props,
		BrowserWindowSymbol,
		SiteScrollBlockerSymbol,
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		TpaModalSymbol,
	],
	(
		props: IPropsStore,
		window: Window,
		siteScrollBlocker: ISiteScrollBlocker,
		{ isMobileView }: TpaCommonsSiteConfig,
		tpaModal: ITpaModal
	): TpaHandlerProvider => {
		const computeModalStyleOverrides = (newSize: WindowSizeDimensions): { width?: number; height?: number } => {
			const dimensions: Array<keyof WindowSizeDimensions> = ['height', 'width']
			return dimensions.reduce((overrides: any, dimension) => {
				const value = newSize[dimension]
				if (!_.isNil(value)) {
					const { unit, size } = parseCssSize(value!)
					if (!unit) {
						overrides[dimension] = size
					}
				}
				return overrides
			}, {})
		}

		const _resizeWindow = (compId: string, newSize: WindowSizeDimensions) => {
			const { options, originCompId } = props.get(compId) as TpaPopupProps
			const updatedOptions = { ...options, ...newSize }

			const styleOverrides = tpaModal.isModal(compId)
				? computeModalStyleOverrides(newSize)
				: computeStyleOverrides(updatedOptions, window, originCompId)
			props.update({
				[compId]: {
					styleOverrides,
				},
			})
			siteScrollBlocker.setSiteScrollingBlocked(isMobileView && isFullScreen(styleOverrides, window), compId)
		}

		return {
			getTpaHandlers() {
				return {
					async resizeWindow(compId, msgData: ResizeWindowMessageData): Promise<void> {
						_resizeWindow(compId, msgData)
					},
					heightChanged(compId, msgData: HeightChangedMessageData): void {
						if (runtimeTpaCompIdBuilder.isRuntimeCompId(compId)) {
							_resizeWindow(compId, { height: msgData.height })
						} else {
							props.update({
								[compId]: {
									heightOverride: msgData.height,
									heightOverflow: Boolean(msgData.overflow), // false by default
								},
							})
						}
					},
				}
			},
		}
	}
)

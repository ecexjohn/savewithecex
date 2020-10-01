import { name } from '../symbols'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { TpaMasterPageConfig, TpaPageConfig } from '../types'
import {
	IPropsStore,
	MasterPageFeatureConfigSymbol,
	PageFeatureConfigSymbol,
	Props,
	TpaHandlerProvider,
	ViewerModel,
} from '@wix/thunderbolt-symbols'
import { AppStyleProps, AppWidgetData } from 'feature-tpa-commons'
import { IOoiTpaSharedConfig, OoiTpaSharedConfigSymbol } from 'feature-ooi-tpa-shared-config'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'

export type MessageData = { version: string }

export type AppIsAliveResponse = AppStyleProps &
	AppWidgetData & {
		fonts: { cssUrls: any; imageSpriteUrl: string; fontsMeta: any }
		commonConfig: ViewerModel['commonConfig']
		isVisualFocusEnabled: boolean
		siteColors: any
		siteTextPresets: any
	}

export const AppIsAliveHandler = withDependencies(
	[
		named(MasterPageFeatureConfigSymbol, name),
		named(PageFeatureConfigSymbol, name),
		CommonConfigSymbol,
		Props,
		OoiTpaSharedConfigSymbol,
	],
	(
		{ siteColors, isVisualFocusEnabled, siteTextPresets }: TpaMasterPageConfig,
		{ widgets }: TpaPageConfig,
		commonConfigAPI: ICommonConfig,
		props: IPropsStore,
		{ getFontsConfig }: IOoiTpaSharedConfig
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				appIsAlive(compId: string, msgData, { originCompId }): AppIsAliveResponse {
					props.update({
						[compId]: {
							sentAppIsAlive: true,
						},
					})
					const widgetData = widgets[originCompId] || {
						style: {
							colors: {},
							numbers: {},
							booleans: {},
							fonts: {},
							googleFontsCssUrl: '',
							uploadFontFaces: '',
						},
					}

					return {
						fonts: getFontsConfig(),
						commonConfig: commonConfigAPI.getCommonConfig(),
						isVisualFocusEnabled,
						siteColors,
						siteTextPresets,
						...widgetData,
					}
				},
			}
		},
	})
)

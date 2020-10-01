import _ from 'lodash'
import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	IPropsStore,
	Props,
	SiteFeatureConfigSymbol,
	pageIdSym,
	PageScrollRegistrarSymbol,
	SdkHandlersProvider,
} from '@wix/thunderbolt-symbols'
import { SiteScrollBlockerSymbol, ISiteScrollBlocker } from 'feature-site-scroll-blocker'
import { IPageScrollRegistrar } from 'feature-page-scroll'
import { name } from './symbols'
import { OOIPageConfig, OOISiteConfig, SetControllerProps } from './types'
import { createHostProps } from './hostProps'
import { OoiTpaSharedConfigSymbol, IOoiTpaSharedConfig } from 'feature-ooi-tpa-shared-config'

export default withDependencies(
	[
		pageIdSym,
		named(PageFeatureConfigSymbol, name),
		named(SiteFeatureConfigSymbol, name),
		Props,
		SiteScrollBlockerSymbol,
		PageScrollRegistrarSymbol,
		OoiTpaSharedConfigSymbol,
	],
	(
		pageId,
		{ ooiComponents, accessibilityEnabled }: OOIPageConfig,
		{ viewMode, formFactor }: OOISiteConfig,
		propsStore: IPropsStore,
		siteScrollBlocker: ISiteScrollBlocker,
		{ registerToThrottledScroll }: IPageScrollRegistrar,
		{ getFontsConfig }: IOoiTpaSharedConfig
	): IPageWillMountHandler & SdkHandlersProvider<{ setControllerProps: SetControllerProps }> => {
		return {
			getSdkHandlers() {
				return {
					setControllerProps(controllerCompId, controllerDataProps, functionNames, invokeFunction) {
						const props = controllerDataProps
						functionNames.forEach((functionName) =>
							_.set(props, functionName, (...args: any) => invokeFunction(functionName, args))
						)
						propsStore.update({
							[controllerCompId]: props,
						})
					},
				}
			},
			async pageWillMount() {
				await Promise.all(
					ooiComponents.map(async (compData) => {
						const hostProps = createHostProps({
							compData,
							pageId,
							accessibilityEnabled,
							formFactor,
							viewMode,
							siteScrollBlocker,
							registerToThrottledScroll,
							fonts: getFontsConfig(),
						})

						propsStore.update({
							[compData.compId]: {
								host: hostProps,
							},
						})
					})
				)
			},
		}
	}
)

import { IComponentsRegistrar } from '@wix/thunderbolt-components-loader'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { name, ReactLoaderForOOISymbol } from './symbols'
import { OOIComponentData, OOIComponentLoader, OOISiteConfig } from './types'
import { reportError } from '@wix/thunderbolt-commons'
import LazySentry from './lazySentry'
import { createTpaWidgetNative } from './tpaWidgetNativeFactory'

export const ooiComponentsRegistrar = withDependencies(
	[named(SiteFeatureConfigSymbol, name), ReactLoaderForOOISymbol],
	({ ooiComponentsData }: OOISiteConfig, loader: OOIComponentLoader): IComponentsRegistrar => {
		const loadComponent = ({ componentUrl, sentryDsn }: OOIComponentData) => async () => {
			try {
				const component = await loader.loadComponent(componentUrl)
				if (!component) {
					reportError(new Error('component is not exported'), LazySentry, sentryDsn)
				}
				return { component: createTpaWidgetNative(component) }
			} catch (error) {
				reportError(error, LazySentry, sentryDsn)
				return { component: createTpaWidgetNative() }
			}
		}
		return {
			registerComponents: (hostAPI) => {
				Object.entries(ooiComponentsData).forEach(([widgetId, { componentUrl, sentryDsn }]) => {
					hostAPI.registerComponent('tpaWidgetNative', loadComponent({ componentUrl, sentryDsn }), widgetId)
				})
			},
		}
	}
)

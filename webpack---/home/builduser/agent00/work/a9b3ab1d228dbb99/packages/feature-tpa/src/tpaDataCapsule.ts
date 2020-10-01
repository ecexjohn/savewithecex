import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { IPageWillMountHandler, PageFeatureConfigSymbol, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { FrameStorageListener } from 'data-capsule'
import { name } from './symbols'
import { TpaPageConfig } from './types'
import { TpaCommonsSiteConfig, name as tpaCommonsName } from 'feature-tpa-commons'

export const DataCapsuleInitializer = (
	metaSiteId: TpaCommonsSiteConfig['metaSiteId'],
	widgets: TpaPageConfig['widgets']
) => {
	const verifier = (p1: unknown, p2: unknown, token: string) => !!widgets[token]

	const interceptor = (options: any, p2: unknown, p3: unknown, token: string) => {
		options.namespace = widgets[token].appDefinitionId
		options.scope = metaSiteId
		return options
	}

	return {
		verifier,
		interceptor,
		// @ts-ignore
		start: () => new FrameStorageListener().start(verifier, interceptor),
	}
}

export const tpaDataCapsule = withDependencies(
	[named(SiteFeatureConfigSymbol, tpaCommonsName), named(PageFeatureConfigSymbol, name)],
	({ metaSiteId }: TpaCommonsSiteConfig, { widgets }: TpaPageConfig): IPageWillMountHandler => {
		return {
			async pageWillMount() {
				// runtime components are not supported in bolt so its ok to use widgets map from config
				DataCapsuleInitializer(metaSiteId, widgets).start()
			},
		}
	}
)

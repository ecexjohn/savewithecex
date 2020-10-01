import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	FeatureStateSymbol,
	StructureAPI,
	IStructureAPI,
	IAppWillLoadPageHandler,
	MasterPageFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { BackgroundGroupFeatureState, BackgroundGroupMasterPageConfig } from './types'
import { name } from './symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { IPageProvider, PageProviderSymbol } from 'feature-pages'

const backgroundGroupAPIFactory = (
	structureAPI: IStructureAPI,
	pageProvider: IPageProvider,
	featureState: IFeatureState<BackgroundGroupFeatureState>,
	masterPageConfig: BackgroundGroupMasterPageConfig
): IAppWillLoadPageHandler => {
	return {
		async appWillLoadPage({ pageId, contextId }) {
			// need to wait for page structure to be loaded
			await pageProvider(contextId, pageId)

			const bgPageId = `pageBackground_${pageId}`
			const isPageTransitionsActive = masterPageConfig.isPageTransitionsActive

			const state = featureState.get()
			const prevBgPageId = state?.backgroundPageId

			const shouldAddPrevBg = isPageTransitionsActive && prevBgPageId && prevBgPageId !== bgPageId
			const isBgAdded = structureAPI.addBackgroundGroupToRenderedTree(
				bgPageId,
				(shouldAddPrevBg && prevBgPageId) || undefined
			)

			featureState.update(() => ({
				backgroundPageId: isBgAdded ? bgPageId : '',
			}))
		},
	}
}

export const BackgroundGroup = withDependencies(
	[StructureAPI, PageProviderSymbol, named(FeatureStateSymbol, name), named(MasterPageFeatureConfigSymbol, name)],
	backgroundGroupAPIFactory
)

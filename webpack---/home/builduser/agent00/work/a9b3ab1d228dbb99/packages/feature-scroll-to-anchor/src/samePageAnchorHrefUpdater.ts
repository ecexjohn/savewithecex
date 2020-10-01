import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	IPageWillMountHandler,
	IPropsStore,
	PageFeatureConfigSymbol,
	Props,
	MasterPageFeatureConfigSymbol,
	IStructureAPI,
	StructureAPI,
} from '@wix/thunderbolt-symbols'
import { QuickActionBarItemProps } from '@wix/thunderbolt-components'
import { ScrollToAnchorMasterPageConfig, ScrollToAnchorPageConfig } from './types'
import { name } from './symbols'
import { IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'

const samePageAnchorHrefUpdaterFactory = (
	pageConfig: ScrollToAnchorPageConfig,
	masterPageConfig: ScrollToAnchorMasterPageConfig,
	propsStore: IPropsStore,
	structureAPI: IStructureAPI,
	urlHistoryManager: IUrlHistoryManager
): IPageWillMountHandler => {
	const getQABUpdatedProps = (compId: string, relativeUrl: string) => {
		const currentActionBarItems = propsStore.get('QUICK_ACTION_BAR').items
		const updatedItems = currentActionBarItems.map((item: QuickActionBarItemProps) =>
			item.compId === compId
				? {
						...item,
						link: { ...item.link, href: relativeUrl },
				  }
				: item
		)

		return {
			items: updatedItems,
		}
	}

	return {
		pageWillMount: async () => {
			const relativeUrl = urlHistoryManager.getRelativeUrl()
			const isHomePageCurrentRoute = relativeUrl === './'

			// no need to update href of comps with top/bottom anchor on homepage because it is already
			// resolved correctly in site assets server for this flow
			const compsWithTopBottomAnchor = isHomePageCurrentRoute ? [] : masterPageConfig.compsWithTopBottomAnchor

			const compsToUpdate = [
				...pageConfig.compsWithCurrentInnerRouteDynamicPageLink,
				...masterPageConfig.compsWithCurrentInnerRouteDynamicPageLink,
				...compsWithTopBottomAnchor,
			]

			if (compsToUpdate.length > 0) {
				const updatedProps = compsToUpdate.reduce((propsToUpdate, compId) => {
					const componentType = structureAPI.get(compId).componentType
					const isQABItem = componentType === 'QuickActionBarItem'

					const targetCompIdForPropsUpdate = isQABItem ? 'QUICK_ACTION_BAR' : compId
					const updatedCompProps = isQABItem
						? getQABUpdatedProps(compId, relativeUrl)
						: {
								link: {
									...propsStore.get(targetCompIdForPropsUpdate).link,
									href: relativeUrl,
								},
						  }

					return {
						...propsToUpdate,
						...{
							[targetCompIdForPropsUpdate]: updatedCompProps,
						},
					}
				}, {})

				propsStore.update(updatedProps)
			}
		},
	}
}

export const SamePageAnchorHrefUpdater = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		Props,
		StructureAPI,
		UrlHistoryManagerSymbol,
	],
	samePageAnchorHrefUpdaterFactory
)

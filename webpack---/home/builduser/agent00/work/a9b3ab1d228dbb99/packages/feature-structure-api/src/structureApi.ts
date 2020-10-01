import {
	IStructureStore,
	IStructureAPI,
	PageAssetsLoaderSymbol,
	IPageAssetsLoader,
	Structure,
} from '@wix/thunderbolt-symbols'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { ComponentsLoaderSymbol, IComponentsLoader } from '@wix/thunderbolt-components-loader'

const structureAPI = (
	structureStore: IStructureStore,
	componentsLoader: IComponentsLoader,
	pageAssetsLoader: IPageAssetsLoader
): IStructureAPI => {
	return {
		get: (compId) => structureStore.get(compId),
		subscribeToChanges: (partial) => structureStore.subscribeToChanges(partial),
		getEntireStore: () => structureStore.getEntireStore(),

		addShellStructure: async () => {
			const structure = {
				DYNAMIC_STRUCTURE_CONTAINER: {
					components: [],
					componentType: 'DynamicStructureContainer',
				},
				'site-root': {
					components: [],
					componentType: 'DivWithChildren',
				},
				main_MF: {
					components: ['site-root', 'DYNAMIC_STRUCTURE_CONTAINER'],
					componentType: 'DivWithChildren',
				},
			}
			structureStore.update(structure)

			await componentsLoader.loadComponents(structure)
		},
		addPageAndRootToRenderedTree: (pageId: string) => {
			const pageBgId = `pageBackground_${pageId}`
			const hasPageBackground = structureStore.get(pageBgId)
			const rootComponents = ['SCROLL_TO_TOP', 'site-root', 'DYNAMIC_STRUCTURE_CONTAINER', 'SCROLL_TO_BOTTOM']

			if (hasPageBackground) {
				rootComponents.splice(1, 0, 'BACKGROUND_GROUP')
			}

			if (structureStore.get('WIX_ADS')) {
				rootComponents.splice(1, 0, 'WIX_ADS')
			}
			const componentsToAdd = {
				main_MF: {
					components: rootComponents,
					componentType: 'DivWithChildren',
				},
				'site-root': {
					components: ['masterPage'],
					componentType: 'DivWithChildren',
				},
				SITE_PAGES: {
					componentType: 'DivWithChildren',
					components: [pageId],
				},
				SCROLL_TO_TOP: {
					components: [],
					componentType: 'Anchor',
				},
				SCROLL_TO_BOTTOM: {
					components: [],
					componentType: 'Anchor',
				},
			}

			structureStore.update(componentsToAdd)
		},
		addBackgroundGroupToRenderedTree: (pageBgId: string, pervPageBgId?: string) => {
			const hasPageBackground = structureStore.get(pageBgId)
			if (hasPageBackground) {
				const components =
					pervPageBgId && structureStore.get(pervPageBgId) ? [pervPageBgId, pageBgId] : [pageBgId]
				structureStore.update({
					BACKGROUND_GROUP: {
						componentType: 'BackgroundGroup',
						components,
					},
				})
				return true
			}
			return false
		},
		removePageBackgroundFromRenderedTree: (pageId: string) => {
			const pageBgId = `pageBackground_${pageId}`
			const bgGroup = structureStore.get('BACKGROUND_GROUP')

			if (bgGroup) {
				const components = structureStore.get('BACKGROUND_GROUP').components
				const pageBgIndex = components.indexOf(pageBgId)
				if (pageBgIndex > -1) {
					components.splice(pageBgIndex, 1)

					structureStore.update({
						BACKGROUND_GROUP: {
							componentType: 'BackgroundGroup',
							components,
						},
					})
				}
			}
		},
		addComponentToDynamicStructure: async (compId, compStructure) => {
			const structure = {
				[compId]: compStructure,
			}
			structureStore.update(structure)
			await componentsLoader.loadComponents(structure)

			const { components } = structureStore.get('DYNAMIC_STRUCTURE_CONTAINER')
			structureStore.update({
				DYNAMIC_STRUCTURE_CONTAINER: {
					componentType: 'DynamicStructureContainer',
					components: [...components, compId],
				},
			})
		},
		isComponentInDynamicStructure: (compId) => {
			const { components } = structureStore.get('DYNAMIC_STRUCTURE_CONTAINER')

			return components.includes(compId)
		},
		removeComponentFromDynamicStructure: (compId) => {
			const { components } = structureStore.get('DYNAMIC_STRUCTURE_CONTAINER')
			structureStore.update({
				DYNAMIC_STRUCTURE_CONTAINER: {
					componentType: 'DynamicStructureContainer',
					components: components.filter((id) => id !== compId),
				},
			})
			// should we delete the comp structure..?
		},
		removeComponentFromParent: (parentId, compId) => {
			const parent = structureStore.get(parentId)
			const components = parent.components.filter((id) => id !== compId)

			structureStore.update({
				[parentId]: { ...parent, components },
			})
		},
		addComponentToParent: (parentId, compId, index) => {
			const parent = structureStore.get(parentId)
			const components = index
				? [...parent.components.slice(0, index), compId, ...parent.components.slice(index)]
				: [...parent.components, compId]

			structureStore.update({
				[parentId]: { ...parent, components },
			})
		},
		loadPageStructure: async (pageId: string, contextId: string) => {
			const pageStructure = await pageAssetsLoader.load(pageId).components
			structureStore.setChildStore(contextId, pageStructure)
			return pageStructure
		},
		cleanPageStructure: (contextId: string) => {
			structureStore.setChildStore(contextId)
		},
		getContextIdOfCompId: (compId: string) => structureStore.getContextIdOfCompId(compId),
	}
}

export const StructureAPI = withDependencies([Structure, ComponentsLoaderSymbol, PageAssetsLoaderSymbol], structureAPI)

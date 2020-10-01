import { Identifier, IocContainer, ProviderCreator } from '@wix/thunderbolt-ioc'
import { ComponentsLoaderSymbol, IComponentsLoader } from '@wix/thunderbolt-components-loader'
import { IPageReflector, PagesSiteConfig } from './types'
import { name } from './symbols'
import {
	FeaturesConfig,
	IPageAssetsLoader,
	IPageWillMountHandler,
	IPropsStore,
	IStructureAPI,
	LifeCycle,
	PageAssets,
	PageAssetsLoaderSymbol,
	PageFeatureConfigSymbol,
	pageIdSym,
	Props,
	StructureAPI,
	MasterPageFeatureConfigSymbol,
	IPageDidUnmountHandler,
	ICompActionsStore,
	CompActionsSym,
	contextIdSymbol,
} from '@wix/thunderbolt-symbols'
import { FeaturesLoaderSymbol, ILoadFeatures } from '@wix/thunderbolt-features'
import { errorPagesIds } from '@wix/thunderbolt-commons'
import _ from 'lodash'

const bindFeaturesConfig = (container: IocContainer, featuresConfig: FeaturesConfig) => {
	Object.keys(featuresConfig).forEach((key) => {
		container
			.bind(PageFeatureConfigSymbol)
			.toConstantValue(featuresConfig[key as keyof FeaturesConfig])
			.whenTargetNamed(key)
	})
}

const createPageReflector = (pageContainer: IocContainer, masterPageReflector?: IPageReflector): IPageReflector => ({
	getAllImplementersOf<T>(identifier: Identifier): Array<T> {
		const pageInstances = pageContainer.getAll<T>(identifier)
		const masterPageInstance = masterPageReflector ? masterPageReflector.getAllImplementersOf<T>(identifier) : []
		return [...masterPageInstance, ...pageInstances]
	},
	getAllImplementersOnPageOf<T>(identifier: symbol): Array<T> {
		return pageContainer.getAll<T>(identifier)
	},
})

export const PageProvider: ProviderCreator<IPageReflector> = (container) => {
	const reflectors: Record<string, Promise<IPageReflector>> = {}

	const pageAssetsLoader = container.get<IPageAssetsLoader>(PageAssetsLoaderSymbol)
	const featuresLoader = container.get<ILoadFeatures>(FeaturesLoaderSymbol)
	const structureApi = container.get<IStructureAPI>(StructureAPI)
	const compActionsStore = container.get<ICompActionsStore>(CompActionsSym)
	const propsStore = container.get<IPropsStore>(Props)
	const componentsLoader = container.get<IComponentsLoader>(ComponentsLoaderSymbol)
	const siteConfig = container.getNamed<PagesSiteConfig>(MasterPageFeatureConfigSymbol, name)

	const setupPageContainer = async (pageId: string, { features, props }: PageAssets) => {
		const pageContainer = container.createChild()
		await featuresLoader.loadPageFeatures(pageContainer, await features)
		bindFeaturesConfig(pageContainer, await props)

		pageContainer.bind<string>(pageIdSym).toConstantValue(pageId)
		return pageContainer
	}

	const createMasterPageReflectorIfNeeded = (pageId: string): Promise<IPageReflector> | Promise<undefined> => {
		if (pageId !== 'masterPage' && (siteConfig.nonPopupPages[pageId] || errorPagesIds[pageId])) {
			reflectors.masterPage = createPage('masterPage', 'masterPage')
			return reflectors.masterPage
		}

		return Promise.resolve(undefined)
	}

	const getPageDidUnmountHandler = ({
		pageId,
		contextId,
		props,
	}: {
		pageId: string
		contextId: string
		props: PageAssets['props']
	}): IPageDidUnmountHandler => {
		const destroyPage = async () => {
			compActionsStore.setChildStore(contextId)
			propsStore.setChildStore(contextId)
			structureApi.cleanPageStructure(contextId)
			delete reflectors[contextId]
		}

		const triggerRenderOnComponents = async () => {
			// Trigger render on all of the masterPage structure component.
			// The underline component will be re-render only if one of the props was updated
			const emptyMap = Object.keys((await props).render.compProps).reduce(
				(acc, compId) => ({ ...acc, [compId]: {} }),
				{}
			)
			propsStore.update(emptyMap)
		}

		return {
			pageDidUnmount: pageId !== 'masterPage' ? destroyPage : triggerRenderOnComponents,
		}
	}

	const createPage = async (pageId: string, contextId: string) => {
		const assets = pageAssetsLoader.load(pageId)

		const masterPage = createMasterPageReflectorIfNeeded(pageId)
		const [pageContainer, pageStructure] = await Promise.all([
			setupPageContainer(pageId, assets),
			structureApi.loadPageStructure(pageId, contextId),
			assets.props.then(({ render }) => propsStore.setChildStore(contextId, render.compProps)),
			assets.components.then((components) =>
				compActionsStore.setChildStore(
					contextId,
					_.mapValues(components, () => ({}))
				)
			),
		])

		const loadComponentsPromise = componentsLoader.loadComponents(pageStructure)
		pageContainer.bind<string>(contextIdSymbol).toConstantValue(contextId)
		pageContainer.bind<IPageWillMountHandler>(LifeCycle.PageWillMountHandler).toConstantValue({
			pageWillMount: () => Promise.all([loadComponentsPromise, assets.css]),
		})

		pageContainer
			.bind<IPageDidUnmountHandler>(LifeCycle.PageDidUnmountHandler)
			.toConstantValue(getPageDidUnmountHandler({ pageId, contextId, props: assets.props }))

		return createPageReflector(pageContainer, await masterPage)
	}

	return (contextId, pageId = contextId) => {
		if (reflectors[contextId]) {
			return reflectors[contextId]
		}

		reflectors[contextId] = createPage(pageId, contextId)
		return reflectors[contextId]
	}
}

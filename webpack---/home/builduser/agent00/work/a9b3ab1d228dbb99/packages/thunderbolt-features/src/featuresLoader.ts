import { AsyncContainerModule } from 'inversify'
import { FeatureName } from '@wix/thunderbolt-symbols'
import { FeatureLoaderParams, FeaturesLoaders, ILoadFeatures } from './Features'
import { IocContainer } from '@wix/thunderbolt-ioc'

export const createFeaturesLoader = (
	featuresLoaders: FeaturesLoaders,
	featureLoaderParams: FeatureLoaderParams
): ILoadFeatures => {
	const loadFeaturesIntoContainer = (
		container: IocContainer,
		featureNames: Array<FeatureName>,
		context: 'site' | 'page'
	): Promise<any> =>
		Promise.all(
			featureNames.map(async (featureName) => {
				const featureLoader = await featuresLoaders[featureName as FeatureName](featureLoaderParams)
				// @ts-ignore
				if (featureLoader.loaders) {
					await container.legacy().loadAsync(
						// @ts-ignore
						...Object.values(featureLoader.loaders).map(({ loader }) => new AsyncContainerModule(loader))
					)
				}
				// @ts-ignore
				const loader = featureLoader[context]
				if (loader) {
					// @ts-ignore
					container.load(loader)
				}
			})
		)
	let pageFeatures = new Set<FeatureName>()
	return {
		getAllFeatureNames() {
			return Object.keys(featuresLoaders) as Array<FeatureName>
		},
		getLoadedPageFeatures() {
			return [...pageFeatures]
		},
		loadSiteFeatures: (container, featureNames) =>
			loadFeaturesIntoContainer(container, featureNames as Array<FeatureName>, 'site'),
		loadPageFeatures: (container, featureNames) => {
			pageFeatures = new Set([...pageFeatures, ...featureNames])
			return loadFeaturesIntoContainer(container, featureNames as Array<FeatureName>, 'page')
		},
	}
}

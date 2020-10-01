import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { FeaturesLoaders, FeaturesLoaderSymbol, ILoadFeatures } from '@wix/thunderbolt-features'
import { featuresLoaders as externalFeaturesLoaders } from 'thunderbolt-features-loaders'
import { Environment } from './types/Environment'

// TODO move all features loaders to their own feature packages
const internalFeaturesLoaders: Partial<FeaturesLoaders> = {
	renderIndicator: () =>
		import('./features/render-indicator/renderIndicator' /* webpackChunkName: "renderIndicator" */),
	bootstrap: () => import('./features/bootstrap' /* webpackChunkName: "bootstrap" */),
	// import('thunderbolt-platform/platformMainThread' /* webpackChunkName: "platformMainThread" */)
	platform: () => import('thunderbolt-platform' /* webpackChunkName: "platform" */),
}

export const featuresLoaders = {
	...internalFeaturesLoaders,
	...externalFeaturesLoaders,
} as FeaturesLoaders

export const site = ({ specificEnvFeaturesLoaders }: Environment): ContainerModuleLoader => (bind) => {
	bind<ILoadFeatures>(FeaturesLoaderSymbol).toConstantValue(specificEnvFeaturesLoaders)
}

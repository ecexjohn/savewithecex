import { IThunderbolt } from '../features/thunderbolt/IThunderbolt'
import { Thunderbolt } from '../features/thunderbolt/types'
import { createEnvLoader } from '../features/env'
import { IocContainer } from '@wix/thunderbolt-ioc'
import { Environment } from '../types/Environment'
import {
	BIReporter,
	FeatureName,
	ILogger,
	IPageAssetsLoader,
	IRenderer,
	MasterPageFeatureConfigSymbol,
	PageAssetsLoaderSymbol,
	RendererSymbol,
} from '@wix/thunderbolt-symbols'
import { DynamicSessionModel, DynamicSessionModelSymbol } from 'feature-session-manager'
import { taskify } from '@wix/thunderbolt-commons'
import { RendererProps } from 'feature-react-renderer'

type DeferredValue<T> = Promise<() => Promise<T>>

export interface ThunderboltInitializer {
	loadEnvironment(environment: Environment): void
	getRenderer<T>(): Promise<IRenderer<RendererProps, T>>
	loadSiteFeatures(): Promise<void>
	getThunderboltInvoker<T extends IThunderbolt>(): DeferredValue<T>
}

const RENDERER_FEATURES: Set<FeatureName> = new Set([
	'renderer',
	'ooi',
	'componentsLoader',
	'stores',
	'translations',
	'businessLogger',
	'assetsLoader',
	'sessionManager',
	'consentPolicy',
	'commonConfig',
	'componentsReact',
	'router',
	'warmupData',
])

const loadMasterPageFeaturesConfigs = async (container: IocContainer) => {
	// This adds the master page structure and props to the fetchCache
	const assetsLoader = container.get<IPageAssetsLoader>(PageAssetsLoaderSymbol)
	const siteFeaturesConfigs = await assetsLoader.load('masterPage').siteFeaturesConfigs

	Object.entries(siteFeaturesConfigs).forEach(([featureName, featureConfig]) => {
		container
			.bind(MasterPageFeatureConfigSymbol)
			.toConstantValue(featureConfig)
			.whenTargetNamed(featureName)
	})
}

const loadDynamicModel = async (
	container: IocContainer,
	{ biReporter, logger }: { biReporter: BIReporter; logger: ILogger }
) => {
	const dynamicModelRaw = await window.fetchDynamicModel
	if (typeof dynamicModelRaw === 'object') {
		container.bind<DynamicSessionModel>(DynamicSessionModelSymbol).toConstantValue(dynamicModelRaw)
		const { visitorId, siteMemberId } = dynamicModelRaw
		biReporter.setDynamicSessionData({ visitorId, siteMemberId })
	} else {
		logger.captureError(new Error(`failed fetching dynamicModel`), {
			tags: { fetchFail: 'dynamicModel' },
			extras: { errorMessage: dynamicModelRaw },
		})
	}
}

export const ThunderboltInitializerImpl: (container: IocContainer) => ThunderboltInitializer = (
	container: IocContainer
) => {
	let environment: Environment | null = null

	return {
		getRenderer: async <T>() => {
			const { specificEnvFeaturesLoaders, biReporter, logger, viewerModel } = environment!
			await taskify(() =>
				specificEnvFeaturesLoaders.loadSiteFeatures(
					container,
					viewerModel.siteFeatures.filter((x) => RENDERER_FEATURES.has(x))
				)
			)
			if (!process.env.browser) {
				await taskify(() => loadMasterPageFeaturesConfigs(container))
			} else {
				await taskify(() => loadDynamicModel(container, { biReporter, logger }))
			}

			return container.get<IRenderer<RendererProps, T>>(RendererSymbol)
		},
		loadEnvironment: (env: Environment) => {
			environment = env
			container.load(createEnvLoader(environment))
		},
		loadSiteFeatures: async () => {
			const { viewerModel, specificEnvFeaturesLoaders } = environment!
			await taskify(() =>
				specificEnvFeaturesLoaders.loadSiteFeatures(
					container,
					viewerModel.siteFeatures.filter((x) => !RENDERER_FEATURES.has(x))
				)
			)
		},
		getThunderboltInvoker: async <T extends IThunderbolt>(): Promise<() => Promise<T>> => {
			return async () => {
				if (process.env.browser) {
					await taskify(() => loadMasterPageFeaturesConfigs(container))
				}

				const thunderbolt = await taskify(() => container.get<T>(Thunderbolt))

				await taskify(() => thunderbolt.ready())

				return thunderbolt
			}
		},
	}
}

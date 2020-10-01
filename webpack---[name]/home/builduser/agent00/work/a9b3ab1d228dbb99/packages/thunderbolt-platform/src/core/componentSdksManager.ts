import _ from 'lodash'
import { ComponentSdks, ComponentSdksLoader, CoreSdkLoaders } from '../types'
import { Model, ComponentSdksManager } from './types'
import { PlatformLogger } from '@wix/thunderbolt-symbols'

export function ComponentSdksManagerFactory({
	loadComponentSdksPromise,
	models,
	logger
}: {
	loadComponentSdksPromise: Promise<ComponentSdksLoader>
	models: Model
	logger: PlatformLogger
}): ComponentSdksManager {
	const componentsSdks: ComponentSdks = {}
	const sdkTypesToCompTypesMapper: ComponentSdksLoader['sdkTypeToComponentTypes'] = {}
	let sdkResolver = _.noop
	const sdkPromise = new Promise((resolve) => (sdkResolver = resolve))

	async function loadCoreComponentSdks(compTypes: Array<string>, coreSdksLoaders: CoreSdkLoaders) {
		const compsPromises = [...compTypes, 'Document']
			.filter((type) => coreSdksLoaders[type])
			.map((type) =>
				coreSdksLoaders[type]()
					.then((sdkFactory) => ({ [type]: sdkFactory }))
					.catch((e) => {
						logger.captureError(new Error('could not load core component SDKs from thunderbolt'), { extra: { type, error: e } })
						return {}
					})
			)
		const sdksArray = await Promise.all(compsPromises)
		return Object.assign({}, ...sdksArray)
	}

	return {
		async fetchComponentsSdks(coreSdksLoaders: CoreSdkLoaders) {
			const compTypes = _(Object.values(models.structureModel))
				.map('componentType')
				.uniq()
				.value()
			logger.interactionStarted('loadComponentSdk')
			const { loadComponentSdks, sdkTypeToComponentTypes } = await loadComponentSdksPromise
			Object.assign(sdkTypesToCompTypesMapper, sdkTypeToComponentTypes || {})
			if (!loadComponentSdks) {
				return
			}
			const componentSdksPromise = loadComponentSdks(compTypes, logger).catch((e) => {
				logger.captureError(new Error('could not load component SDKs from loadComponentSdks function'), { extra: { compTypes, error: e } })
				return {}
			})
			const [coreSdks, sdks] = await Promise.all([loadCoreComponentSdks(compTypes, coreSdksLoaders), componentSdksPromise]).catch((e) => {
				logger.captureError(new Error('could not load component SDKs'), { extra: { compTypes, error: e } })
				return []
			})
			Object.assign(componentsSdks, sdks, coreSdks)
			sdkResolver()
			logger.interactionEnded('loadComponentSdk')
		},
		waitForSdksToLoad() {
			return sdkPromise
		},
		getComponentSdkFactory(compType, compInfo) {
			const sdkFactory = componentsSdks[compType]
			if (!sdkFactory) {
				logger.captureError(new Error('could not find component SDK'), { tags: { compType }, extra: { ...compInfo, componentsSdks: _.keys(componentsSdks), compType } })
				return
			}
			return sdkFactory
		},
		getSdkTypeToComponentTypes(sdkType: string) {
			return sdkTypesToCompTypesMapper[sdkType] || []
		}
	}
}

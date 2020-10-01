import { SdkInstance } from '@wix/thunderbolt-symbols'

export type CompCacheParams = {
	controllerCompId: string
	compId: string
	role: string
}
export type InstanceCacheFactory = {
	setSdkInstance(compCacheParams: CompCacheParams, instance: SdkInstance): void
	getSdkInstance(compCacheParams: CompCacheParams): SdkInstance | undefined
	deleteInstanceFromCache(compCacheParams: CompCacheParams): void
	getAllInstances(): Record<string, any>
}
export function instanceCacheFactory(): InstanceCacheFactory {
	const instanceCache: Record<string, any> = {}

	const createCacheKey = ({ controllerCompId, compId, role }: CompCacheParams) => `${controllerCompId}-${compId}-${role}`

	return {
		setSdkInstance(compCacheParams, instance) {
			const key = createCacheKey(compCacheParams)
			instanceCache[key] = instance
		},
		getSdkInstance(compCacheParams) {
			const key = createCacheKey(compCacheParams)
			return instanceCache[key]
		},
		getAllInstances() {
			return instanceCache
		},
		deleteInstanceFromCache(compCacheParams) {
			const key = createCacheKey(compCacheParams)
			delete instanceCache[key]
		}
	}
}

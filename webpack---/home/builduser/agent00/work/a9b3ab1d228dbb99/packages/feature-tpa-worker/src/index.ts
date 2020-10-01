import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { TpaWorkerFactory } from './tpaWorker'
import { TpaWorkerSymbol } from './symbols'

export const site: ContainerModuleLoader = (bind, bindAll) => {
	bindAll([LifeCycle.AppDidMountHandler, TpaWorkerSymbol], TpaWorkerFactory)
}

export * from './types'
export { TpaWorkerSymbol }

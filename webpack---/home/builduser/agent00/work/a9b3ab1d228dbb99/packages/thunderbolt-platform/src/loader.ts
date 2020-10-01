import {
	LifeCycle,
	PlatformEvnDataProviderSymbol,
	PlatformStorageSymbol,
	PlatformSymbol,
	PlatformViewportAPISym,
	PlatformWorkerPromiseSym,
	WixCodeSdkHandlersProviderSym
} from '@wix/thunderbolt-symbols'
import { PlatformInitializerSym } from './symbols'
import { PlatformInitializer } from './types'
import { Platform } from './platform'
import { siteFeaturesSdkProviders } from './wixCodeSdkRegistrar'
import { ContainerModuleLoader, FactoryWithDependencies } from '@wix/thunderbolt-ioc'
import { Storage } from './storage/storage'
import { locationEnvDataProvider, windowEnvDataProvider, documentEnvDataProvider, experimentsEnvDataProvider } from './platformEnvData'
import { platformHandlersProvider } from './platformHanders'
import { platformViewportAPI } from './viewportHanders'

export function createLoaders(platformInitializer: FactoryWithDependencies<PlatformInitializer>): { site: ContainerModuleLoader } {
	return {
		site: (bind, bindAll) => {
			bindAll([PlatformSymbol, LifeCycle.AppWillLoadPageHandler], Platform)
			bindAll([PlatformStorageSymbol, WixCodeSdkHandlersProviderSym], Storage)
			bind(PlatformInitializerSym).to(platformInitializer)
			bind(WixCodeSdkHandlersProviderSym).to(platformHandlersProvider)
			bindAll([PlatformViewportAPISym, LifeCycle.AppWillLoadPageHandler], platformViewportAPI)
			bind(LifeCycle.AppWillMountHandler).to(siteFeaturesSdkProviders)
			bind(PlatformEvnDataProviderSymbol).to(locationEnvDataProvider)
			bind(PlatformEvnDataProviderSymbol).to(windowEnvDataProvider)
			bind(PlatformEvnDataProviderSymbol).to(documentEnvDataProvider)
			bind(PlatformEvnDataProviderSymbol).to(experimentsEnvDataProvider)
			if (process.env.browser) {
				bind(PlatformWorkerPromiseSym).toConstantValue(require('./client/create-worker'))
			} else {
				bind(PlatformWorkerPromiseSym).toConstantValue({})
			}
		}
	}
}

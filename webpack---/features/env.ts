import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import * as logger from './logger/logger'
import * as bi from './bi/bi'
import * as experiments from './experiments'
import * as viewerModel from './viewer-model/viewer-model'
import * as fetchApi from './client-fetch/client-fetch'
import * as componentsLibrariesLoader from './componentsLoader/componentsLibrariesLoader'
import * as featuresLoadersLoader from '../featureLoaders'
import * as featureStateLoader from 'thunderbolt-feature-state'
import { Environment } from '../types/Environment'
import { SiteAssetsClientSym, BrowserWindowSymbol, ReducedMotionSymbol } from '@wix/thunderbolt-symbols'
import { WarmupDataPromiseSymbol } from 'feature-warmup-data'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

// TODO tmp put this here until able to use the one defined in thunderbolt-site-assets-client
const siteAssetsClientLoader = {
	site: ({ siteAssetsClient }: Environment): ContainerModuleLoader => (bind) => {
		bind(SiteAssetsClientSym).toConstantValue(siteAssetsClient)
	},
}

const browserWindowLoader = {
	site: ({ browserWindow }: Environment): ContainerModuleLoader => (bind) => {
		bind(BrowserWindowSymbol).toConstantValue(browserWindow)
	},
}

const reducedMotionLoader = {
	site: ({ browserWindow, experiments: openExperiments }: Environment): ContainerModuleLoader => (bind) => {
		const reducedMotion = prefersReducedMotion(browserWindow, openExperiments)
		bind(ReducedMotionSymbol).toConstantValue(reducedMotion)
	},
}

const warmupDataLoader = {
	site: ({ warmupData }: Environment): ContainerModuleLoader => (bind) => {
		bind(WarmupDataPromiseSymbol).toConstantValue(warmupData)
	},
}

const loaders = [
	logger,
	bi,
	experiments,
	viewerModel,
	fetchApi,
	componentsLibrariesLoader,
	featuresLoadersLoader,
	featureStateLoader,
	siteAssetsClientLoader,
	browserWindowLoader,
	warmupDataLoader,
	reducedMotionLoader,
]

export const createEnvLoader = (env: Environment): ContainerModuleLoader => (bind, bindAll) => {
	loaders.forEach((loaderCreator) => loaderCreator.site(env)(bind, bindAll))
}

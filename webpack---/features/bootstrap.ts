import * as pageInitializer from './pageInitializer/pageInitializer'
import * as thunderbolt from './thunderbolt/Thunderbolt'
import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'

const featureLoaders = [pageInitializer, thunderbolt]

export const site: ContainerModuleLoader = (bind, bindAll) =>
	featureLoaders.forEach(({ site: siteLoader }) => siteLoader(bind, bindAll))

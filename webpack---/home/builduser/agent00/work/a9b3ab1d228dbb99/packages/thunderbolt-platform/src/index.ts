import { createLoaders } from './loader'
import PlatformWorkerInitializer from './client/platformWorkerInitializer'

const { site } = createLoaders(PlatformWorkerInitializer)
export { site }

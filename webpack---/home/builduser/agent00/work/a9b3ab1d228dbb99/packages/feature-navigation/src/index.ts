import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Navigation } from './navigation'
import { NavigationSymbol } from './symbols'
import { INavigation } from './types'

export const page: ContainerModuleLoader = (bind) => {
	bind(NavigationSymbol).to(Navigation)
}

// Public Types
export { INavigation }

// Public Symbols
export { NavigationSymbol }

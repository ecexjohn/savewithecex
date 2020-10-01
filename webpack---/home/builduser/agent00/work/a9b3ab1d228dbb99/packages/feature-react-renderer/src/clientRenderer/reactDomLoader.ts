import { IAppWillMountHandler } from '@wix/thunderbolt-symbols'
import { withDependencies } from '@wix/thunderbolt-ioc'

type ReactDomLoaderFactory = () => IAppWillMountHandler

const reactDomLoader: ReactDomLoaderFactory = () => ({
	// @ts-ignore
	appWillMount: () => window.ReactDomLoaded,
})

export const ReactDomLoader = withDependencies([], reactDomLoader)

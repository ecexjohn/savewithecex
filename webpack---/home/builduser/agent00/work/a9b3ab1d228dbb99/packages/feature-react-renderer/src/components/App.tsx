import StructureComponent from './StructureComponent'
import Context from './AppContext'
import React, { Fragment, useEffect } from 'react'
import { AppProps, RendererProps } from '../types'
import { extendStoreWithSubscribe } from './extendStoreWithSubscribe'
import { IPropsStore, IStructureStore } from '@wix/thunderbolt-symbols'
import ComponentsStylesOverrides from './ComponentsStylesOverrides'

function App({
	structure,
	props,
	compsLifeCycle,
	compEventsRegistrar,
	comps,
	compControllers,
	logger,
	translate,
	batchingStrategy,
	createCompControllerArgs,
	onDidMount = () => {},
}: AppProps) {
	const contextValue: RendererProps = {
		structure: extendStoreWithSubscribe<IStructureStore>(structure, batchingStrategy),
		props: extendStoreWithSubscribe<IPropsStore>(props, batchingStrategy),
		compsLifeCycle,
		compEventsRegistrar,
		logger,
		comps,
		compControllers,
		translate,
		createCompControllerArgs,
	}

	useEffect(onDidMount, [onDidMount])

	return (
		<Fragment>
			<Context.Provider value={contextValue}>
				<ComponentsStylesOverrides />
				<StructureComponent key="main_MF" id="main_MF" />
			</Context.Provider>
		</Fragment>
	)
}

export default App

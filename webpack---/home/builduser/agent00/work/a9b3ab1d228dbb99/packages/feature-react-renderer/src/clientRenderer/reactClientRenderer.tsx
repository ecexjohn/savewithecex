import { withDependencies } from '@wix/thunderbolt-ioc'
import { BatchingStrategy, IRendererPropsProvider, RendererProps } from '../types'
import { RendererPropsProviderSym, BatchingStrategySymbol } from '../symbols'
import App from '../components/App'
import React from 'react'
import ReactDOM from 'react-dom'
import { IRenderer } from '@wix/thunderbolt-symbols'

let appDidMountResolver: () => void
const appDidMountPromise = new Promise((resolve) => {
	appDidMountResolver = resolve
})

const reactClientRenderer = (
	rendererProps: IRendererPropsProvider,
	batchingStrategy: BatchingStrategy
): IRenderer<RendererProps, Promise<void>> => ({
	getRendererProps: rendererProps.getRendererProps,
	init: async () => {
		await rendererProps.resolveRendererProps()
	},
	render: async () => {
		const target = document.getElementById('SITE-CONTAINER') as HTMLElement
		await new Promise((resolve) =>
			ReactDOM.hydrate(
				<React.StrictMode>
					<App
						{...rendererProps.getRendererProps()}
						batchingStrategy={batchingStrategy}
						onDidMount={appDidMountResolver}
					/>
				</React.StrictMode>,
				target,
				resolve
			)
		)
		await appDidMountPromise
	},
})

export const ReactClientRenderer = withDependencies(
	[RendererPropsProviderSym, BatchingStrategySymbol],
	reactClientRenderer
)

import { withDependencies } from '@wix/thunderbolt-ioc'
import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { OOIComponentLoader } from './types'

async function loadRequireJS() {
	await new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = 'https://static.parastorage.com/unpkg/requirejs-bolt@2.3.6/requirejs.min.js'
		script.onload = resolve
		script.onerror = reject
		document.head.appendChild(script)
	})
	// @ts-ignore
	window.define('lodash', [], () => _)
	// @ts-ignore
	window.define('reactDOM', [], () => ReactDOM)
	// @ts-ignore
	window.define('react', [], () => React)
}

// eslint-disable-next-line prettier/prettier
export default withDependencies([], (): OOIComponentLoader => {
		let waitForRequireJsToLoad: Promise<unknown> | null = null
		return {
			loadComponent(componentUrl: string) {
				return new Promise(async (resolve, reject) => {
					waitForRequireJsToLoad = waitForRequireJsToLoad || loadRequireJS()
					await waitForRequireJsToLoad
					__non_webpack_require__(
						[componentUrl],
						(module: any) => resolve(module?.default?.component),
						reject
					)
				})
			},
		}
	}
)

import { FetchFn, SiteAssetsClientTopology, SiteAssetsManifests, SiteAssetsModuleName } from '@wix/thunderbolt-symbols'
import { ModuleFetcherRequest, SiteAssetsModuleFetcher } from 'site-assets-client'
import _ from 'lodash'

type Topology = {
	pathInFileRepo:
		| SiteAssetsClientTopology['pathOfTBModulesInFileRepoForFallback']
		| SiteAssetsClientTopology['pathToEditorElementsModulesInFileRepoForFallback']
	fileRepoUrl: SiteAssetsClientTopology['fileRepoUrl']
}
const loadModule = (
	moduleName: SiteAssetsModuleName,
	manifests: SiteAssetsManifests,
	{ pathInFileRepo, fileRepoUrl }: Topology,
	fetchFn: FetchFn
) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return async (module: object = {}, exports: object = {}) => {
		const moduleHash: string = manifests.web.modulesToHashes[moduleName]
		const webpackRuntimeBundleHash: string = manifests.web.webpackRuntimeBundle

		const moduleFileUrl = `${fileRepoUrl}/${pathInFileRepo}${moduleName}.${moduleHash}.js`
		const webpackRuntimeBundleUrl = `${fileRepoUrl}/${pathInFileRepo}webpack-runtime.${webpackRuntimeBundleHash}.js`

		const webpackRuntime = await fetchFn(webpackRuntimeBundleUrl).then((resp) => resp.text())
		const script = await fetchFn(moduleFileUrl).then((resp) => resp.text())

		// eslint-disable-next-line no-eval
		eval(webpackRuntime)
		// eslint-disable-next-line no-eval
		eval(script)
		// @ts-ignore
		return module.exports.default
	}
}

async function loadRequireJS() {
	// @ts-ignore
	await window.ThunderboltElementsLoaded
	await new Promise((resolve, reject) => {
		const script = document.createElement('script')
		// TODO adapt protocol accoring to request
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js'
		script.onload = resolve
		script.onerror = reject
		document.head.appendChild(script)
	})

	// @ts-ignore
	window.define('_', [], () => _)
}

const loadDataFixersModule = (moduleName: string, version: string, clientTopology: SiteAssetsClientTopology) => {
	const getModuleFileUrl = () => {
		const getHighestVersion = () => {
			const splitVersion = version.split('.')
			const major = parseInt(splitVersion[0], 10)
			const minor = parseInt(splitVersion[1], 10)

			return major > 1 && minor > 987 ? version : '1.987.0'
		}

		const highestVersion = getHighestVersion()

		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
			// use hardcoded version that includes thunderbolt dedicated build
			return `${clientTopology.moduleRepoUrl}/${moduleName}@${highestVersion}/dist/${moduleName}-thunderbolt.js`
		} else {
			return `${clientTopology.moduleRepoUrl}/${moduleName}@${highestVersion}/dist/${moduleName}-thunderbolt.min.js`
		}
	}

	const waitForRequireJsToLoad = loadRequireJS()

	return new Promise(async (resolve, reject) => {
		await waitForRequireJsToLoad
		__non_webpack_require__([getModuleFileUrl()], (module: any) => resolve(module), reject)
	})
}

export const clientModuleFetcher = (
	fetchFn: FetchFn,
	clientTopology: SiteAssetsClientTopology,
	manifests: { thunderbolt: SiteAssetsManifests; tbElements: SiteAssetsManifests }
): SiteAssetsModuleFetcher => {
	return {
		fetch: async <T>(request: ModuleFetcherRequest): Promise<T> => {
			const { module, version } = request

			if (module.startsWith('thunderbolt-')) {
				const topology: Topology = {
					fileRepoUrl: clientTopology.fileRepoUrl,
					pathInFileRepo: clientTopology.pathOfTBModulesInFileRepoForFallback,
				}
				return await loadModule(module as SiteAssetsModuleName, manifests.thunderbolt, topology, fetchFn)()
			} else if (module.startsWith('siteAssets')) {
				const topology: Topology = {
					fileRepoUrl: clientTopology.fileRepoUrl,
					pathInFileRepo: clientTopology.pathToEditorElementsModulesInFileRepoForFallback,
				}
				return await loadModule(module as SiteAssetsModuleName, manifests.tbElements, topology, fetchFn)()
			} else {
				return (await loadDataFixersModule(module, version, clientTopology)) as T
			}
		},
	}
}

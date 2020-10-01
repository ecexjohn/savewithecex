import _ from 'lodash'
import 'regenerator-runtime/runtime' // dbsm expects regeneratorRuntime to be defined :/

declare let self: DedicatedWorkerGlobalScope & {
	define: ((nameOrDependencies: string | Array<string>, dependenciesOrFactory: Array<string> | Function, factory?: Function) => void) & { amd?: boolean }
}

export type ModuleLoader = { AMDLoader: <T>(url: string, scriptName: string, appIdentifier?: { appDefinitionId: string; controllerType?: string }) => Promise<T> }

export default function({ importScripts, scriptsCache = {} }: { importScripts: any; scriptsCache?: Record<string, any> }): ModuleLoader {
	const AMDLoader: ModuleLoader['AMDLoader'] = async (url, scriptName, appIdentifier) => {
		if (scriptsCache[url]) {
			return scriptsCache[url]
		}

		const modulesToInjectToApp: any = {
			lodash: _,
			_,
			'wix-data': { default: { dsn: 'https://b58591105c1c42be95f1e7a3d5b3755e@sentry.io/286440' } }
		}

		let moduleInstace = null

		self.define = (nameOrDependencies, dependenciesOrFactory, factory) => {
			const isNamedDefine = _.isString(nameOrDependencies)
			// const moduleName = isNamedDefine ? args[0] : null
			const moduleDependencies = ((isNamedDefine ? dependenciesOrFactory : nameOrDependencies) || []) as Array<string>
			const moduleFactory = (isNamedDefine ? factory : dependenciesOrFactory) as Function
			moduleInstace = moduleFactory && moduleFactory(...moduleDependencies.map((d) => modulesToInjectToApp[d]))
		}

		// self.require = (pkg) => {
		// 	return sdks[pkg] || null
		// }

		self.define.amd = true
		// until we require scripts to be bundled as named modules we can not make the following step async
		// https://requirejs.org/docs/whyamd.html#namedmodules
		await importScripts(url, scriptName, appIdentifier)
		delete self.define

		return Promise.resolve(moduleInstace)
	}

	return {
		AMDLoader
	}
}

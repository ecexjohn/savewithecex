import { SiteAssetsClientAdapter } from 'thunderbolt-site-assets-client'
import { BatchedUpdateFunction, BootstrapData, ViewerAPI } from '../types'
import { init } from './index'
import moduleLoaderFactory from './loadModules'
import { batchUpdateFactory } from './batchUpdate'
import { platformLoggerCreator } from './platformLoggerFactory'
import { FetchFn, PlatformLogger } from '@wix/thunderbolt-symbols'

declare const self: {
	importScripts: (url: string) => void
	onmessage: (msg: MessageEvent) => void
	fetch: FetchFn
	location: Location
	commonConfig: BootstrapData['commonConfig']
}

if (self.location && self.location.protocol === 'blob:') {
	/*  blob protocol is used to overcome CORS issue when creating WebWorker.
		fetch will not apply host protocol to requests starting with '//' when host protocol is blob so it must be fixed
		manually */

	const originalFetch = self.fetch.bind(self)

	self.fetch = (url: string, requestInit?: RequestInit) => {
		if (url.startsWith('//')) {
			url = `https:${url}`
		} else if (url.startsWith('/')) {
			url = `${self.location.origin}${url}`
		}
		return originalFetch(url, requestInit)
	}
}

export async function startWorker({
	bootstrapData,
	viewerAPI,
	componentSdksUrl,
	scriptsCache = {},
	siteAssetsClientWorkerAdapter
}: {
	bootstrapData: BootstrapData
	viewerAPI: ViewerAPI
	componentSdksUrl: string
	scriptsCache?: Record<string, any>
	siteAssetsClientWorkerAdapter: (fetchFn: FetchFn, logger: PlatformLogger) => SiteAssetsClientAdapter
}) {
	const {
		platformEnvData: { bi },
		clientSpecMap
	} = bootstrapData
	const logger: PlatformLogger = platformLoggerCreator({ biData: bi, clientSpecMap, url: bootstrapData.platformEnvData.location.rawUrl, isSSR: bootstrapData.platformEnvData.window.isSSR })
	const importScripts = (url: string, scriptName: string, appIdentifier?: { appDefinitionId: string; controllerType?: string }) => {
		return appIdentifier
			? logger.withReportingAndErrorHandling('script_loaded', () => self.importScripts(url), appIdentifier)
			: logger.runAsyncAndReport(`import_scripts_${scriptName}`, () => self.importScripts(url))
	}
	const moduleLoader = moduleLoaderFactory({ importScripts, scriptsCache })
	self.commonConfig = bootstrapData.commonConfig
	const flushes: Array<() => void> = []

	if (bootstrapData.mode.disablePlatformBatchedUpdates === false) {
		const createBatchedUpdate = (updateFunc: BatchedUpdateFunction) => {
			const { batchUpdate, flushUpdates } = batchUpdateFactory(updateFunc, false /* do not schedule flush on first render / SSR */)
			flushes.push(flushUpdates)
			return batchUpdate
		}
		viewerAPI.updateProps = createBatchedUpdate(viewerAPI.updateProps)
		viewerAPI.updateStyles = createBatchedUpdate(viewerAPI.updateStyles)
	}

	await init({
		bootstrapData,
		viewerAPI,
		moduleLoader,
		importScripts,
		siteAssetsClient: siteAssetsClientWorkerAdapter(self.fetch, logger),
		componentSdksUrl,
		logger
	})

	flushes.forEach((flush) => flush())
}

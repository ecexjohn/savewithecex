import { FetchFn, PlatformLogger } from '@wix/thunderbolt-symbols'

// Load `core-js` on older browsers that are missing key features
if (typeof Promise === 'undefined' || typeof Set === 'undefined' || typeof Object.assign === 'undefined' || typeof Array.from === 'undefined' || typeof Symbol === 'undefined') {
	importScripts('https://static.parastorage.com/unpkg/core-js-bundle@3.2.1/minified.js')
}

import 'proxy-polyfill'
import _ from 'lodash'
import { expose, proxy } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax
import { BootstrapData, ViewerAPI } from '../types'
import { startWorker } from '../core/worker'
import { createClientSAC, toClientSACFactoryParamsFrom } from 'thunderbolt-site-assets-client'
import { platformFedopsMetricsReporter } from '@wix/thunderbolt-commons'

const start = async (bootstrapData: BootstrapData, updateProps: ViewerAPI['updateProps'], invokeSdkHandler: ViewerAPI['invokeSdkHandler'], updateStyles: ViewerAPI['updateStyles']) => {
	const arrayOfUpdatePromises: Array<Promise<any> | void> = []
	const viewerAPI: ViewerAPI = {
		updateProps: (data: any) => {
			const promise = updateProps(data)
			arrayOfUpdatePromises.push(promise)
		},
		updateStyles: (data: any) => {
			const promise = updateStyles(data)
			arrayOfUpdatePromises.push(promise)
		},
		invokeSdkHandler: (pageId, path, ...args) => {
			if (args.length > 4) {
				console.error('sdk handlers support up to 4 arguments')
				return
			}
			const proxiedArgs = args.map((arg: any) => (_.isFunction(arg) ? proxy(arg) : arg))
			const promise = invokeSdkHandler(pageId, path, proxiedArgs[0], proxiedArgs[1], proxiedArgs[2], proxiedArgs[3])
			if (path === 'setControllerProps') {
				arrayOfUpdatePromises.push(promise)
			}
			return promise
		}
	}

	const siteAssetsClientWorkerAdapter = (fetchFn: FetchFn, logger: PlatformLogger) => {
		const {
			siteAssetsClientInitParams: {
				siteAssetsClientConfig: { isStagingRequest },
				deviceInfo
			},
			mode: { qa },
			experiments,
			platformEnvData: {
				location: { rawUrl }
			}
		} = bootstrapData

		return createClientSAC(
			toClientSACFactoryParamsFrom({
				siteAssets: bootstrapData.siteAssetsClientInitParams,
				env: 'clientWorker',
				deviceInfo,
				qa,
				experiments,
				requestUrl: rawUrl,
				fetchFn,
				isStagingRequest,
				moduleFetcher: {} as any,
				siteAssetsMetricsReporter: platformFedopsMetricsReporter(logger)
			})
		)
	}

	await startWorker({
		viewerAPI,
		bootstrapData,
		componentSdksUrl: bootstrapData.componentSdksClientUrl,
		siteAssetsClientWorkerAdapter
	})
	// wait for all prop updates to finish before resolving the main platform promise to make sure props are updated before render
	await Promise.all(arrayOfUpdatePromises)
}

expose(start)

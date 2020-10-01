import 'proxy-polyfill'
import { proxy, wrap } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax
import { BootstrapData, PlatformInitializer, ViewerAPI } from '../types'
import { platformWorkerPromise } from './create-worker'
import { withDependencies } from '@wix/thunderbolt-ioc'

function PlatformWorkerInitializer(): PlatformInitializer {
	return {
		async init(bootstrapData: BootstrapData, viewerAPI: ViewerAPI) {
			const worker = (await platformWorkerPromise) as Worker
			const startWorker: any = wrap(worker)
			return startWorker(bootstrapData, proxy(viewerAPI.updateProps), proxy(viewerAPI.invokeSdkHandler), proxy(viewerAPI.updateStyles))
		}
	}
}

export default withDependencies<PlatformInitializer>([], PlatformWorkerInitializer)

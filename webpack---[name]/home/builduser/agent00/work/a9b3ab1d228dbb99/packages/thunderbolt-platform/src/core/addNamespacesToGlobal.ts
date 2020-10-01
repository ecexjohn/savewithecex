import { WixCodeApi } from '@wix/thunderbolt-symbols'
import _ from 'lodash'

declare let self: any
/**
 * since user code is using require (browserify), setting the self will not work since the SDK is cached in the require cache.
 * the fix it, we merge the new sdk API into the same reference that is cached in require... :(
 */
function assignWithGettersAndSetters(target: any, source: any) {
	Object.defineProperties(target, _.fromPairs(Object.keys(source).map((key) => [key, Object.getOwnPropertyDescriptor(source, key)!])))
}
function mergeToSelf(name: string, sdk: any) {
	if (!self[name]) {
		self[name] = sdk
	} else {
		assignWithGettersAndSetters(self[name], sdk)
	}
}
export function addNamespacesToGlobal(wixCodeApi: WixCodeApi) {
	_.forEach(wixCodeApi, (sdk, namespace) => {
		if (namespace === 'events') {
			// https://github.com/wix-private/js-wixcode-sdk/blob/03a175cc86168107b4904d3950c7f66d6844bc9e/js/modules/targets/wixCode.es6#L181
			// do nothing - namespace events is internal
			return
		}
		// https://github.com/wix-private/js-wixcode-namespaces/blob/acdccaebbc0e64db161b5726fc54d4d91d059646/wixcode-users/src/index.js#L6
		if (namespace === 'user') {
			mergeToSelf('wix-users', sdk)
			return
		}
		// https://github.com/wix-private/js-wixcode-namespaces/blob/e4f0ff6c0cb82d6d5abfba7aa5f4439078334526/wixcode-events/src/index.ts#L4
		if (namespace === 'wixEvents') {
			self['wix-events'] = sdk
			mergeToSelf('wix-events', sdk)
			return
		}
		// https://github.com/wix-private/cloud-runtime/blob/master/packages/bundler/cloud-bundler-core/lib/bundler/client-global-libs.js
		mergeToSelf(`wix-${namespace}`, sdk)
	})
}

import { optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	PlatformWorkerPromise,
	PlatformWorkerPromiseSym,
	SdkHandlersProvider,
	PublicAPIs,
	TpaHandlerProvider,
} from '@wix/thunderbolt-symbols'
import { loadScriptTag, loadScriptWithRequireJS, scriptUrls } from '@wix/thunderbolt-commons'

async function loadPmRpc() {
	if (window.pmrpc) {
		return window.pmrpc
	}
	if (window.define && window.define.amd) {
		return loadScriptWithRequireJS(scriptUrls.PM_RPC)
	}
	await loadScriptTag(scriptUrls.PM_RPC)
	return window.pmrpc
}

export const publicApiTPAHandler = withDependencies(
	[optional(PlatformWorkerPromiseSym)],
	(platformWorkerPromiseObj: {
		platformWorkerPromise: PlatformWorkerPromise
	}): TpaHandlerProvider & SdkHandlersProvider<any> => {
		let alreadyInvoked = false
		let resolvePublicApiGetter: Function
		const waitForAppsToRegister: Promise<Function> = new Promise((res) => {
			resolvePublicApiGetter = res
		})
		return {
			getTpaHandlers() {
				return {
					waitForWixCodeWorkerToBeReady: async () => {
						if (alreadyInvoked) {
							return {}
						}

						const [pmRpc, worker, getPublicApiNames] = (await Promise.all([
							loadPmRpc(),
							platformWorkerPromiseObj.platformWorkerPromise,
							waitForAppsToRegister,
						])) as Array<any>
						const appsPublicApisNames = await getPublicApiNames()
						await Promise.all(
							appsPublicApisNames.map((appName: string) =>
								pmRpc.api.request(appName, { target: worker }).then((publicAPI: PublicAPIs) => {
									pmRpc.api.set(appName, publicAPI)
								})
							)
						)
						alreadyInvoked = true

						return {}
					},
				}
			},
			getSdkHandlers: () => ({
				// TODO Or Granit 06/07/2020: GilEck promised that he'll refactor this ugly pattern
				registerPublicApiGetter: (appsPublicApisGetter: Function) => {
					resolvePublicApiGetter(appsPublicApisGetter)
				},
			}),
		}
	}
)

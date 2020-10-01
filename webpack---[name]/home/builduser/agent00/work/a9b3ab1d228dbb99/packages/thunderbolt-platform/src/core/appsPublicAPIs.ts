import { AppModule, AppPublicApiUtils, PublicAPIs } from '@wix/thunderbolt-symbols'
import _ from 'lodash'

export function createAppsPublicAPIsFactory({ handlers, importScripts, pageId }: { handlers: any; importScripts: any; pageId: string }): AppPublicApiUtils {
	const publicAPIs: Record<string, PublicAPIs> = {}

	return {
		getPublicAPI: (appDefinitionId: string) =>
			publicAPIs[appDefinitionId] ? Promise.resolve(publicAPIs[appDefinitionId]) : Promise.reject(`Error - getPublicAPI of ${appDefinitionId} does not exist or app did not expose a public api`),
		registerAppsPublicApis: (appModules: Record<string, AppModule>) => {
			_.forEach(appModules, (appModule, appDefId) => {
				if (appModule.exports && !_.isEmpty(appModule.exports)) {
					publicAPIs[appDefId] = appModule.exports
				}
			})

			if (process.env.browser && handlers.registerPublicApiGetter) {
				handlers.registerPublicApiGetter(async () => {
					if (!self.pmrpc) {
						await importScripts('https://static.parastorage.com/unpkg/pm-rpc@2.0.0/build/pm-rpc.min.js', 'pm-rpc')
					}

					return _.map(publicAPIs, (publicAPI, appDefinitionId) => {
						const name = `viewer_platform_public_api_${appDefinitionId}_${pageId}`
						self.pmrpc.api.set(name, publicAPI)
						return name
					})
				})
			}
		}
	}
}

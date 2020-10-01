import _ from 'lodash'
import { ControllerDataItem, AppModule, WixCodeApi, PlatformAPI, PlatformUtils, PlatformLogger } from '@wix/thunderbolt-symbols'
import { BootstrapData } from '../types'
import { ControllersExports, Model } from './types'
import { createAppParams } from './appsAPI/appParams'
import { createControllersParams } from './appsAPI/controllerParams'
import { createPlatformAppServicesApi } from './appsAPI/platformServicesAPI'
import { importAndInitElementorySupport } from './elementorySupport'
import { ClientSpecMapAPI } from './clientSpecMapService'
import { AppsUrlAPI } from './appsUrlService'
import { WixCodeViewerAppUtils } from './wixCodeViewerAppUtils'
import { ModuleLoader } from './loadModules'
import { WixSelector } from './wixSelector'
import { BsiManager } from './bsiManagerModule'
import { CreateSetPropsForOOI } from './setPropsFactory'
import { addNamespacesToGlobal } from './addNamespacesToGlobal'

export function Applications({
	wixSelector,
	models,
	clientSpecMapApi,
	appsUrlApi,
	bootstrapData,
	importScripts,
	moduleLoader,
	wixCodeViewerAppUtils,
	logger,
	wixCodeApiPromise,
	createSetPropsForOOI,
	waitForUpdatePropsPromises,
	controllersExports,
	createPlatformApiForApp,
	bsiManager,
	platformUtils
}: {
	wixSelector: WixSelector
	models: Model
	clientSpecMapApi: ClientSpecMapAPI
	appsUrlApi: AppsUrlAPI
	bootstrapData: BootstrapData
	importScripts: Function
	moduleLoader: ModuleLoader
	wixCodeViewerAppUtils: WixCodeViewerAppUtils
	logger: PlatformLogger
	wixCodeApiPromise: Promise<WixCodeApi>
	createSetPropsForOOI: CreateSetPropsForOOI
	waitForUpdatePropsPromises: () => Promise<any>
	controllersExports: ControllersExports
	createPlatformApiForApp: (applicationId: string, instanceId: string) => PlatformAPI
	bsiManager: BsiManager
	platformUtils: PlatformUtils
}) {
	const {
		wixCodeBootstrapData,
		csrfToken,
		externalBaseUrl,
		platformServicesAPIData,
		experiments,
		routerReturnedData,
		platformEnvData: { bi: biData, document: documentData },
		disabledPlatformApps
	} = bootstrapData
	const { applications, connections } = models.platformModel
	const isAppRunning = (appDefId: string | undefined) => appDefId && applications[appDefId]
	const isWixCodeRunning = isAppRunning(clientSpecMapApi.getWixCodeAppDefinitionId())
	const isDatabindingRunning = isAppRunning(clientSpecMapApi.getDataBindingAppDefinitionId())

	async function loadControllerModule({ controllerType, applicationId: appDefinitionId }: ControllerDataItem): Promise<Record<string, any>> {
		const controllerScriptUrl = appsUrlApi.getControllerScriptUrl(appDefinitionId, controllerType)

		const controllerModule = controllerScriptUrl ? await moduleLoader.AMDLoader(controllerScriptUrl, 'controllerScript', { appDefinitionId, controllerType }) : null
		return controllerModule ? { [controllerType]: controllerModule } : {}
	}

	async function startApplications() {
		if (isWixCodeRunning || isDatabindingRunning) {
			await importAndInitElementorySupport({
				importScripts,
				wixCodeBootstrapData,
				wixCodeInstance: platformUtils.sessionServiceApi.getWixCodeInstance(),
				viewMode: 'site',
				externalBaseUrl,
				csrfToken,
				logger
			})
		}

		const appModules = await Promise.all(
			_.map(applications, async (controllers: Record<string, ControllerDataItem>, appDefinitionId: string) => {
				if (disabledPlatformApps[appDefinitionId]) {
					console.warn(`Application ${appDefinitionId} is disabled via query params.`)
					return {}
				}
				const controllersData = _.values(controllers)
				const isWixCode = appDefinitionId === clientSpecMapApi.getWixCodeAppDefinitionId()
				const viewerScriptUrl = appsUrlApi.getViewerScriptUrl(appDefinitionId)
				if (!viewerScriptUrl) {
					/**
					 * Might be because clientSpecMap data corruption (App is missing) or might be because OOI migration
					 */
					logger.captureError(new Error('Could not find viewerScriptUrl. The Application might be missing from the CSM'), { extra: { appDefinitionId } })
					return {}
				}
				const appSpecData = clientSpecMapApi.getAppSpecData(appDefinitionId)
				const appModulePromise = moduleLoader.AMDLoader<AppModule>(viewerScriptUrl, 'viewerScript', { appDefinitionId })
				const controllerModulesPromise = Promise.all(_.map(controllersData, loadControllerModule)).then((modulesArray) => Object.assign({}, ...modulesArray))
				const routerConfigMap = _.filter(bootstrapData.platformAPIData.routersConfigMap, { appDefinitionId })
				const appParams = createAppParams({
					appSpecData,
					wixCodeViewerAppUtils,
					routerReturnedData,
					routerConfigMap,
					appInstance: platformUtils.sessionServiceApi.getInstance(appDefinitionId),
					baseUrls: appsUrlApi.getBaseUrls(appDefinitionId),
					viewerScriptUrl
				})
				const instanceId = appParams.instanceId
				const platformApi = createPlatformApiForApp(appDefinitionId, instanceId)
				const platformAppServicesApi = createPlatformAppServicesApi({
					documentData,
					biData,
					appDefinitionId,
					instanceId,
					platformServicesAPIData,
					experiments,
					csrfToken,
					bsiManager
				})

				const wixCodeApi = await wixCodeApiPromise
				/*
				 * TODO storage is a namespace in the sense that you can "import storage from wix-storage",
				 *  but it's not a namespace in the sense that it's bound to appDefId and instanceId.
				 *  consider creating wixCodeApi per app.
				 */
				wixCodeApi.storage = platformApi.storage

				platformUtils.wixCodeNamespacesRegistry.registerWixCodeNamespaces(wixCodeApi)
				const controllersParams = createControllersParams(
					createSetPropsForOOI,
					controllersData,
					connections,
					wixSelector,
					appSpecData,
					appParams,
					wixCodeApi,
					platformAppServicesApi,
					platformApi,
					csrfToken
				)
				const appModule = await appModulePromise
				if (!appModule) {
					// error loading app module. errors are reported via moduleLoader.
					return {}
				}

				if (appModule.initAppForPage) {
					await logger.withReportingAndErrorHandling('init_app_for_page', () => appModule.initAppForPage!(appParams, platformApi, wixCodeApi, platformAppServicesApi), { appDefinitionId })
				}
				if (isWixCode) {
					addNamespacesToGlobal(wixCodeApi)
				}
				const controllerModules = await controllerModulesPromise

				logger.reportAppPhasesNetworkAnalysis(appDefinitionId)
				const controllerPromises = await logger.withReportingAndErrorHandling('create_controllers', () => appModule.createControllers(controllersParams, controllerModules), {
					appDefinitionId
				})
				if (!controllerPromises) {
					return
				}

				await Promise.all(
					controllerPromises.map(async (controllerPromise, index) => {
						const controllerParams = controllersParams[index]
						const reportingParams = { appDefinitionId, controllerType: controllerParams.type }
						const controller = await logger.withReportingAndErrorHandling('await_controller_promise', () => controllerPromise, reportingParams)
						if (!controller) {
							return
						}

						controllersExports[controllerParams.compId] = controller.exports
						const $w = controllersParams[index].$w

						$w.onReady(() => logger.withReportingAndErrorHandling('controller_page_ready', () => Promise.resolve(controller.pageReady($w, wixCodeApi)), reportingParams))
					})
				)
				return { [appDefinitionId]: appModule }
			})
		)

		platformUtils.appsPublicApisUtils.registerAppsPublicApis(Object.assign({}, ...appModules))

		await wixSelector.flushOnReadyCallbacks()
		await waitForUpdatePropsPromises()
	}

	return {
		startApplications
	}
}

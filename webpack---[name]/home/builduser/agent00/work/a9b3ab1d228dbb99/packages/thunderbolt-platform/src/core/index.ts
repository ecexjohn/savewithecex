import { ComponentSdksLoader, CoreSdkLoaders } from '../types'
import { ControllersExports, InitArgs } from './types' // TODO move all core types to ./types
import ClientSpecMapApi from './clientSpecMapService'
import AppsUrlApi from './appsUrlService'
import SessionServiceAPI from './sessionService'
import WixSelector from './wixSelector'
import WixCodeViewerAppUtils from './wixCodeViewerAppUtils'
import { Applications } from './applications'
import modelBuilder from './model'
import { createWixCodeApi } from './createWixCodeSdk'
import { createLinkUtils, getDecodedUrlObject, logSdkError, logSdkWarning } from '@wix/thunderbolt-commons'
import createSdkFactoryParams from './createSdkFactoryParams'
import setPropsFactory from './setPropsFactory'
import { ControllerEvents } from './ControllerEvents'
import { DocumentSdkFactory } from './componentsSDK/Document'
import _ from 'lodash'
import { createPlatformApi } from './appsAPI/platformAPI'
import CommonConfigManager from './commonConfigModule'
import BsiManagerModule from './bsiManagerModule'
import { createAppsPublicAPIsFactory } from './appsPublicAPIs'
import { PlatformUtils } from '@wix/thunderbolt-symbols'
import { createWixCodeNamespacesRegistry } from './WixCodeNamespacesRegistry'
import { platformBiLoggerFactory as biUtils } from './bi/biLoggerFactory'
import { instanceCacheFactory } from './instanceCache'
import { ComponentSdksManagerFactory } from './componentSdksManager'
import { RegisterEventFactory } from './createRegisterEvent'
import { PlatformAnimationsAPI } from '../animations'

const createProxy = (handle: Function) => new Proxy({}, { get: (__, prop) => handle(prop) })

export async function init({ bootstrapData, logger, importScripts, siteAssetsClient, moduleLoader, componentSdksUrl, viewerAPI }: InitArgs) {
	logger.interactionStarted('initialisation')
	const platformEnvData = bootstrapData.platformEnvData
	platformEnvData.url = getDecodedUrlObject(platformEnvData.location.rawUrl)

	const loadComponentSdksPromise = moduleLoader.AMDLoader<ComponentSdksLoader>(componentSdksUrl, 'componentSdks').catch((e) => {
		logger.captureError(new Error('could not load component SDKs loader'), { extra: { componentSdksUrl, error: e } })
		return {}
	})
	const createSdkHandlers = (pageId: string) => createProxy((handlerName: string) => (...args: any) => viewerAPI.invokeSdkHandler(pageId, handlerName, ...args))
	const handlers = createSdkHandlers(bootstrapData.currentPageId) as any
	const { getModel } = modelBuilder({ bootstrapData, logger, siteAssetsClient, handlers })
	const models = await logger.runAsyncAndReport('getAllModels', getModel)
	const componentSdksManager = ComponentSdksManagerFactory({ loadComponentSdksPromise, models, logger })
	if (_.isEmpty(models.platformModel.applications)) {
		return
	}
	const sdkInstancesCache = instanceCacheFactory()
	const getCompRefById = (compId: string) => createProxy((functionName: string) => (...args: any) => handlers.invokeCompRefFunction(compId, functionName, args))
	const clientSpecMapApi = ClientSpecMapApi({ bootstrapData })
	const appsUrlApi = AppsUrlApi({ bootstrapData })
	const sessionServiceApi = SessionServiceAPI({ bootstrapData, handlers })
	const controllerEventsFactory = ControllerEvents()
	const commonConfigManager = CommonConfigManager(bootstrapData, createSdkHandlers)
	const bsiManager = BsiManagerModule(commonConfigManager, bootstrapData, createSdkHandlers)
	const linkUtils = createLinkUtils({
		getCompIdByWixCodeNickname: models.getCompIdByWixCodeNickname,
		getRoleForCompId: models.getRoleForCompId,
		routingInfo: bootstrapData.routingInfo,
		metaSiteId: bootstrapData.platformServicesAPIData.link.metaSiteId,
		userFileDomainUrl: bootstrapData.platformServicesAPIData.link.userFileDomainUrl,
		isPremiumDomain: bootstrapData.platformServicesAPIData.link.isPremiumDomain,
		routersConfig: bootstrapData.platformAPIData.routersConfigMap,
		popupPages: bootstrapData.platformServicesAPIData.link.popupPages
	})
	const appsPublicApisUtils = createAppsPublicAPIsFactory({ handlers, importScripts, pageId: bootstrapData.currentPageId })
	const wixCodeNamespacesRegistry = createWixCodeNamespacesRegistry()
	const platformUtils: PlatformUtils = {
		linkUtils,
		sessionServiceApi,
		appsPublicApisUtils,
		wixCodeNamespacesRegistry,
		biUtils
	}
	const { createSetProps, waitForUpdatePropsPromises, createSetPropsForOOI } = setPropsFactory({ models, viewerAPI, logger, handlers })
	const registerEventFactory = RegisterEventFactory({ handlers, models, componentSdksManager })
	const animationsApi = PlatformAnimationsAPI(handlers.runAnimation)
	const { getSdkFactoryParams } = createSdkFactoryParams({
		animationsApi,
		sdkInstancesCache,
		platformUtils,
		viewerAPI,
		models,
		createSdkHandlers,
		getCompRefById,
		logger,
		createSetProps,
		registerEventFactory
	})
	const wixSelector = WixSelector({
		bootstrapData,
		models,
		getSdkFactoryParams,
		controllerEventsFactory,
		sdkInstancesCache,
		componentSdksManager,
		logger
	})
	const reporter = {
		logSdkError,
		logSdkWarning
	}
	const controllersExports: ControllersExports = {}

	const AppControllerSdkLoader = async () => {
		const [{ composeSDKFactories, createElementPropsSDKFactory }, { AppControllerSdkFactory }] = await Promise.all([
			import('@wix/editor-elements-corvid-utils' /* webpackChunkName: "editor-elements-corvid-utils" */),
			import('./componentsSDK/AppController' /* webpackChunkName: "AppController.corvid" */)
		])

		const sdk = AppControllerSdkFactory({ controllersExports, models, controllerEventsFactory })
		// @ts-ignore TODO: fix types
		return composeSDKFactories(createElementPropsSDKFactory({ useHiddenCollapsed: false }), sdk)
	}

	const AppWidgetSdkLoader = async () => {
		const [{ composeSDKFactories, createElementPropsSDKFactory, childrenPropsSDKFactory }, { AppControllerSdkFactory }] = await Promise.all([
			import('@wix/editor-elements-corvid-utils' /* webpackChunkName: "editor-elements-corvid-utils" */),
			import('./componentsSDK/AppController' /* webpackChunkName: "AppController.corvid" */)
		])
		const sdk = AppControllerSdkFactory({ controllersExports, models, controllerEventsFactory })
		// @ts-ignore TODO: fix types
		return composeSDKFactories(createElementPropsSDKFactory(), childrenPropsSDKFactory, sdk)
	}

	const RepeaterSdkLoader = async () => {
		const { RepeaterSdk } = await import('./componentsSDK/repeaters' /* webpackChunkName: "Repeater.corvid" */)
		return RepeaterSdk({
			models,
			viewerAPI,
			wixSelector,
			reporter
		})
	}

	const DocumentSdkLoader = async () => Promise.resolve(DocumentSdkFactory({ models, wixSelector }))

	const coreSdks: CoreSdkLoaders = {
		AppController: AppControllerSdkLoader,
		AppWidget: AppWidgetSdkLoader,
		TPAWidget: AppControllerSdkLoader,
		tpaWidgetNative: AppControllerSdkLoader,
		Repeater: RepeaterSdkLoader,
		Document: DocumentSdkLoader
	}
	componentSdksManager.fetchComponentsSdks(coreSdks)
	const wixCodeViewerAppUtils = WixCodeViewerAppUtils({ bootstrapData, models, controllerEventsFactory, registerEventFactory, logger, wixSelector })
	const wixCodeApiPromise = logger.runAsyncAndReport('createWixCodeApi', () =>
		createWixCodeApi({
			bootstrapData,
			wixCodeViewerAppUtils,
			models,
			platformUtils,
			createSdkHandlers,
			platformEnvData
		})
	)
	const createPlatformApiForApp = createPlatformApi(bootstrapData, platformUtils, handlers)

	const { startApplications } = Applications({
		platformUtils,
		clientSpecMapApi,
		appsUrlApi,
		models,
		bootstrapData,
		importScripts,
		moduleLoader,
		wixCodeViewerAppUtils,
		wixSelector,
		logger,
		wixCodeApiPromise,
		createSetPropsForOOI,
		waitForUpdatePropsPromises,
		controllersExports,
		createPlatformApiForApp,
		bsiManager
	})
	logger.interactionEnded('initialisation')
	await logger.runAsyncAndReport('startApplications', startApplications)
}

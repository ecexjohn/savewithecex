import { AppSpecData, AppParams, DynamicRouteData } from '@wix/thunderbolt-symbols'
import { WixCodeAppDefId } from '../constants'
import { RouterConfig } from '@wix/thunderbolt-ssr-api'

export function createAppParams({
	appSpecData,
	wixCodeViewerAppUtils,
	routerReturnedData,
	routerConfigMap,
	appInstance,
	baseUrls,
	viewerScriptUrl
}: {
	appSpecData: AppSpecData
	wixCodeViewerAppUtils: any
	routerReturnedData: DynamicRouteData | null
	routerConfigMap: Array<RouterConfig> | null
	appInstance: string
	baseUrls: Record<string, string> | null | undefined
	viewerScriptUrl: string
}): AppParams {
	const createSpecificAppDataByApp: { [appDefId: string]: (appData: AppSpecData) => any } = {
		[WixCodeAppDefId]: wixCodeViewerAppUtils.createWixCodeAppData
	}

	return {
		appInstanceId: appSpecData.appDefinitionId,
		appDefinitionId: appSpecData.appDefinitionId,
		appName: appSpecData.appDefinitionName || appSpecData.type || appSpecData.appDefinitionId,
		instanceId: appSpecData.instanceId,
		instance: appInstance,
		url: viewerScriptUrl,
		baseUrls,
		appData: createSpecificAppDataByApp[appSpecData.appDefinitionId] ? createSpecificAppDataByApp[appSpecData.appDefinitionId](appSpecData) : null,
		appRouters: routerConfigMap,
		routerReturnedData: routerReturnedData?.pageData
	}
}

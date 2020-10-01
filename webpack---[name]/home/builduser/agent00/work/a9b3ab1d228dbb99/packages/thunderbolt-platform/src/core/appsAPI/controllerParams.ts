import _ from 'lodash'
import { Connections, ControllerDataItem, ControllerDataAPI, AppParams, WixCodeApi, PlatformAPI, PlatformServicesAPI, AppSpecData } from '@wix/thunderbolt-symbols'
import { WixSelector } from '../wixSelector'
import { CreateSetPropsForOOI } from '../setPropsFactory'

export function createControllersParams(
	createSetPropsForOOI: CreateSetPropsForOOI,
	controllersData: Array<ControllerDataItem>,
	connections: Connections,
	wixSelector: WixSelector,
	appSpecData: AppSpecData,
	appParams: AppParams,
	wixCodeApi: WixCodeApi,
	platformAppServicesApi: PlatformServicesAPI,
	platformApi: PlatformAPI,
	csrfToken: string
): Array<ControllerDataAPI> {
	return controllersData.map((controllerData) => {
		const { controllerType, compId, templateId, config, externalId } = controllerData
		return {
			$w: wixSelector.create$w(compId),
			compId: templateId ?? compId,
			name: _.get(appSpecData, ['widgets', controllerType, 'tpaWidgetId']) || _.get(appSpecData, ['widgets', controllerType, 'appPage', 'id']) || controllerType,
			type: controllerType,
			config,
			connections: _.flatMap(connections[compId], _.values),
			warmupData: null,
			appParams,
			platformAPIs: Object.assign(platformApi, platformAppServicesApi),
			wixCodeApi,
			csrfToken,
			setProps: createSetPropsForOOI(compId),
			externalId
		}
	})
}

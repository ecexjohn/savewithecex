import { BootstrapData } from '../types'
import { AppSpecData } from '@wix/thunderbolt-symbols'
import _ from 'lodash'

export const DATA_BINDING_APP_DEF_ID = 'dataBinding'

export type ClientSpecMapAPI = {
	getViewerScriptUrl(appDefinitionId: string): string | null
	getControllerScript(appDefinitionId: string, widgetId: string): string
	getAppSpecData(appDefinitionId: string): AppSpecData
	isWixCodeInstalled(): boolean
	getWixCodeAppDefinitionId(): string | undefined
	getDataBindingAppDefinitionId(): string
}

export default function({ bootstrapData }: { bootstrapData: BootstrapData }): ClientSpecMapAPI {
	const { clientSpecMap, wixCodeBootstrapData } = bootstrapData
	const wixCodeAppData = wixCodeBootstrapData.wixCodeAppDefinitionId && clientSpecMap[wixCodeBootstrapData.wixCodeAppDefinitionId]
	return {
		getViewerScriptUrl(appDefinitionId: string) {
			const appData = clientSpecMap[appDefinitionId]
			if (!appData) {
				return null
			}
			return appData.appFields.platform.viewerScriptUrl
		},
		getControllerScript(appDefinitionId: string, widgetId: string) {
			const appData = clientSpecMap[appDefinitionId]
			if (!appData || !appData.widgets) {
				return null
			}
			return _.get(appData.widgets[widgetId], 'componentFields.controllerUrl')
		},
		getAppSpecData(appDefinitionId: string): AppSpecData {
			return clientSpecMap[appDefinitionId]
		},
		isWixCodeInstalled() {
			return !!wixCodeAppData
		},
		getWixCodeAppDefinitionId() {
			return wixCodeBootstrapData.wixCodeAppDefinitionId
		},
		getDataBindingAppDefinitionId() {
			return DATA_BINDING_APP_DEF_ID
		}
	}
}

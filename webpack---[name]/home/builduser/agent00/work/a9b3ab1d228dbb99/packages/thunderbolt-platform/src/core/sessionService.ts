import _ from 'lodash'
import { BootstrapData } from '../types'
import { SessionServiceAPI, OnInstanceChangedCallback } from '@wix/thunderbolt-symbols'
import { DATA_BINDING_APP_DEF_ID } from './clientSpecMapService'

const WIX_CODE_APP_DEF_ID = '675bbcef-18d8-41f5-800e-131ec9e08762'

export default function({ bootstrapData, handlers }: { bootstrapData: BootstrapData; handlers: any }): SessionServiceAPI {
	const _onInstanceChangedCallbacks: { [appDefinitionId: string]: Array<OnInstanceChangedCallback> } = {}

	const fireOnInstanceChanged = (appDefinitionId: string, instance: string): void => {
		_onInstanceChangedCallbacks[appDefinitionId] && _.forEach(_onInstanceChangedCallbacks[appDefinitionId], (callback) => callback({ instance }))
	}
	const _appDefIdToInstance = _.mapValues(bootstrapData.applicationsInstances, 'instance')

	if (process.env.browser) {
		handlers.onLoadSession(({ results: appDefIdToInstance }: any) => {
			_.forEach(appDefIdToInstance, (instance: string, appDefinitionId: string) => {
				_appDefIdToInstance[appDefinitionId] = instance
				fireOnInstanceChanged(appDefinitionId, instance)
			})
		})
	}

	const onInstanceChanged = (callback: OnInstanceChangedCallback, appDefinitionId: string): void => {
		if (!_onInstanceChangedCallbacks[appDefinitionId]) {
			_onInstanceChangedCallbacks[appDefinitionId] = []
		}
		_onInstanceChangedCallbacks[appDefinitionId].push(callback)
	}

	function getWixCodeInstance() {
		return _appDefIdToInstance[WIX_CODE_APP_DEF_ID]
	}

	const getInstance = (appDefinitionId: string): string => {
		if (appDefinitionId === DATA_BINDING_APP_DEF_ID) {
			return _appDefIdToInstance[WIX_CODE_APP_DEF_ID]
		}
		return _appDefIdToInstance[appDefinitionId]
	}

	const loadNewSession = () => handlers.loadNewSession()

	return {
		getInstance,
		onInstanceChanged,
		getWixCodeInstance,
		loadNewSession
	}
}

import { getFullId, getItemId } from '@wix/thunderbolt-commons'
import { EVENT_CONTEXT_SCOPE } from './constants'
import { ComponentSdksManager, Model } from './types'
import { componentSdkFactoryArgs } from '@wix/thunderbolt-platform-types'
import { SdkInstance } from '@wix/thunderbolt-symbols'
import { getRepeaterScopeContext } from './repeaterUtils'

export type RegisterEventFactory = {
	createRegisterEvent(compId: string, getSdkInstance: () => SdkInstance): componentSdkFactoryArgs['registerEvent']
	getCreateEventFunction(getSdkInstance: () => SdkInstance): componentSdkFactoryArgs['createEvent']
}

export function RegisterEventFactory({ handlers, models, componentSdksManager }: { handlers: any; models: Model; componentSdksManager: ComponentSdksManager }): RegisterEventFactory {
	function getEventContext(compId: string) {
		const repeaterCompId = models.getRepeaterIdByCompId(getFullId(compId))
		if (repeaterCompId) {
			return getRepeaterScopeContext(repeaterCompId, getItemId(compId))
		}

		return { type: EVENT_CONTEXT_SCOPE.GLOBAL_SCOPE }
	}

	function getCreateEventFunction(getSdkInstance: () => any) {
		return function createEvent(e: any) {
			const target = getSdkInstance()
			const context = getEventContext(target.uniqueId)
			return {
				...e,
				target,
				context
			}
		}
	}

	function createRegisterEvent(compId: string, getSdkInstance: () => SdkInstance) {
		const createEventFunction = getCreateEventFunction(getSdkInstance)
		return function registerEvent<EventHandler extends Function = Function>(eventName: string, eventHandler: EventHandler) {
			handlers.registerEvent(compId, eventName, async ([event, ...rest]: Array<any> = [{}]) => {
				await componentSdksManager.waitForSdksToLoad()
				eventHandler(createEventFunction(event), ...rest)
			})
		}
	}

	return {
		getCreateEventFunction,
		createRegisterEvent
	}
}

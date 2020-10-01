import _ from 'lodash'
import { componentSdkFactoryArgs, ComponentSdkFactory } from '@wix/thunderbolt-platform-types'
import { AppControllerSDK } from '../../types'
import { ControllersExports, Model } from '../types'
import { IControllerEvents } from '../ControllerEvents'

const GLOBAL_SCOPE = 'GLOBAL_SCOPE'
function assignWithGettersAndSetters(target: any, source: any) {
	Object.defineProperties(target, _.fromPairs(Object.keys(source).map((key) => [key, Object.getOwnPropertyDescriptor(source, key)!])))
}
export function AppControllerSdkFactory({
	controllersExports,
	models,
	controllerEventsFactory
}: {
	controllersExports: ControllersExports
	models: Model
	controllerEventsFactory: IControllerEvents
}): ComponentSdkFactory {
	return ({ compId }: componentSdkFactoryArgs): AppControllerSDK => {
		const controllerEvents = controllerEventsFactory.createScopedControllerEvents(compId)
		const controllerExportsFunc = controllersExports[compId]
		const controllerExports = controllerExportsFunc
			? controllerExportsFunc({
					type: GLOBAL_SCOPE,
					id: GLOBAL_SCOPE,
					additionalData: {}
			  })
			: {}

		const controllerApi = {
			get type() {
				return models.getControllerTypeByCompId(compId)
			},
			on(event: string, callback: Function, context: any) {
				controllerEvents.on(event, callback, context)
			},
			off(event: string, callback: Function) {
				controllerEvents.off(event, callback)
			},
			once(event: string, callback: Function, context: any) {
				controllerEvents.once(event, callback, context)
			}
		}
		assignWithGettersAndSetters(controllerApi, controllerExports)
		return controllerApi
	}
}

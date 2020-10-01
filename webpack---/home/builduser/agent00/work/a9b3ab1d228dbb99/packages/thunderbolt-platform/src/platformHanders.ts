import { withDependencies } from '@wix/thunderbolt-ioc'
import { CompEventsRegistrarSym, CompRefAPI, CompRefAPISym, ICompEventsRegistrar, SdkHandlersProvider, PlatformViewportAPISym } from '@wix/thunderbolt-symbols'
import _ from 'lodash'
import { PlatformViewPortAPI } from './viewportHanders'

export const platformHandlersProvider = withDependencies(
	[CompRefAPISym, CompEventsRegistrarSym, PlatformViewportAPISym],
	(compRefAPI: CompRefAPI, compEventsRegistrar: ICompEventsRegistrar, viewPortAPI: PlatformViewPortAPI): SdkHandlersProvider<any> => {
		function serializeEvent(args: any = []) {
			if (args[0] && args[0].nativeEvent instanceof Event) {
				const [event, ...rest] = args
				const originalNativeEvent = event.nativeEvent
				const serializedEvent = _.omitBy(event, _.isObject)
				serializedEvent.nativeEvent = _.omitBy(originalNativeEvent, _.isObject) // we need to keep the native event data because it is used in the event API
				return [serializedEvent, ...rest]
			}
			return args
		}

		return {
			getSdkHandlers() {
				return {
					invokeCompRefFunction: async (compId: string, functionName: string, args: any) => {
						const compRef: any = await compRefAPI.getCompRefById(compId)
						return compRef[functionName](...args)
					},
					registerEvent(compId: string, eventName: string, eventHandler: Function) {
						if (['onViewportLeave', 'onViewportEnter'].includes(eventName)) {
							viewPortAPI[eventName as 'onViewportLeave' | 'onViewportEnter'](compId, eventHandler)
							return
						}
						compEventsRegistrar.register(compId, eventName, (...args: any) => eventHandler(serializeEvent(args)))
					}
				}
			}
		}
	}
)

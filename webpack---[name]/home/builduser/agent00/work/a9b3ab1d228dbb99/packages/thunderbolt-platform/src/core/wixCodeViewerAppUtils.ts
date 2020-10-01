import _ from 'lodash'
import { BootstrapData } from '../types'
import { Model, EventHandlers } from './types'
import { AppSpecData, PlatformLogger } from '@wix/thunderbolt-symbols'
import { getFullId, isDisplayedOnly } from '@wix/thunderbolt-commons'
import { MasterPageId, EVENT_TYPES_MAP } from './constants'
import { IControllerEvents } from './ControllerEvents'
import { RegisterEventFactory } from './createRegisterEvent'
import { WixSelector } from './wixSelector'
import { convertToCorvidMouseEvent } from '@wix/editor-elements-corvid-utils'

export interface WixCodeViewerAppUtils {
	createWixCodeAppData(
		appData: AppSpecData
	): {
		userCodeMap: Array<{
			url: string
			displayName: string
			id: string
			scriptName: string
		}>
	}
	setStaticEventHandlers(eventHandlers: EventHandlers): void
}

export default function({
	bootstrapData,
	models,
	controllerEventsFactory,
	registerEventFactory,
	wixSelector,
	logger
}: {
	bootstrapData: BootstrapData
	models: Model
	controllerEventsFactory: IControllerEvents
	registerEventFactory: RegisterEventFactory
	wixSelector: WixSelector
	logger: PlatformLogger
}) {
	const { wixCodePageIds } = bootstrapData.wixCodeBootstrapData
	const { orderedControllers, staticEvents, connections } = models.platformModel
	const { structureModel } = models
	const [componentStaticEvents, controllerStaticEvents] = _.partition(staticEvents, (event) => !_.includes(orderedControllers, event.compId))

	function getCompIdFromEventOrModels(compIdFromEvent: string): string {
		let compId = compIdFromEvent
		if (isDisplayedOnly(compId)) {
			compId = getFullId(compId)
		}
		if (structureModel[compId!]) {
			return compId
		} else {
			const connection = _.head(connections.wixCode[compId!])
			return connection!.compId
		}
	}

	function staticHandlersForComponents(fnName: string, handler: Function) {
		const event = _.find(componentStaticEvents, { callbackId: fnName })
		if (event) {
			const { eventType } = event
			const resolvedCompId = getCompIdFromEventOrModels(event.compId)
			if (!EVENT_TYPES_MAP[eventType] || !resolvedCompId) {
				logger.captureError(new Error('wix code static event Error: could not find component or event in the given static event behavior data'), {
					extra: {
						...event,
						fnName
					}
				})
				return
			}
			const registerEventForComp = registerEventFactory.createRegisterEvent(resolvedCompId, () =>
				wixSelector.getInstance({
					compType: models.getCompType(resolvedCompId) as string,
					controllerCompId: 'wixCode',
					compId: resolvedCompId,
					role: models.getRoleForCompId(resolvedCompId, 'wixCode') || ''
				})
			)
			registerEventForComp(EVENT_TYPES_MAP[eventType] as string, (wixCodeEvent: any) => handler(convertToCorvidMouseEvent(wixCodeEvent), wixSelector.create$w('wixCode')))
		}
	}

	function staticHandlersForControllers(fnName: string, handler: () => void) {
		const event = _.find(controllerStaticEvents, { callbackId: fnName })
		if (event) {
			const { compId, eventType } = event
			controllerEventsFactory.createScopedControllerEvents(compId).on(eventType, handler)
		}
	}

	return {
		createWixCodeAppData() {
			return {
				userCodeMap: [MasterPageId, bootstrapData.currentPageId!]
					.filter((pageId) => wixCodePageIds[pageId])
					.map((pageId: string) => ({
						url: wixCodePageIds[pageId],
						displayName: pageId === MasterPageId ? 'site' : `${bootstrapData.platformEnvData.site.pageIdToTitle[pageId]} page`,
						id: pageId,
						scriptName: `${pageId}.js`
					}))
			}
		},
		setStaticEventHandlers: async (eventHandlers: EventHandlers) => {
			const [componentsHandlers, controllersHandlers] = _.partition(Object.keys(eventHandlers), (fnName) => _.find(componentStaticEvents, { callbackId: fnName }))
			componentsHandlers.forEach((fnName) => {
				staticHandlersForComponents(fnName, eventHandlers[fnName])
			})
			controllersHandlers.forEach((fnName) => {
				staticHandlersForControllers(fnName, eventHandlers[fnName])
			})
		}
	}
}

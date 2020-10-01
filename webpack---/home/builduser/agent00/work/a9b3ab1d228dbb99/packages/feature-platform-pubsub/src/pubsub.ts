import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPubsub } from './types'
import { BrowserWindowSymbol, BrowserWindow } from '@wix/thunderbolt-symbols'

const hub: {
	[appDefId: string]: {
		[eventName: string]: {
			persistentData: Array<{ name: string; data: any }>
			listeners: { [compId: string]: Array<Function> }
		}
	}
} = {}
export const TPA_PUB_SUB_PREFIX = 'TPA_PUB_SUB_'

export function stripPubSubPrefix(str: string) {
	const prefixRegex = new RegExp(`^${TPA_PUB_SUB_PREFIX}`)
	return str.replace(prefixRegex, '')
}

function sendToIframe(compId: string, dataToPublish: any, window: BrowserWindow) {
	const comp = window!.document.getElementById(compId)
	if (!comp) {
		return
	}
	const iframe = comp.getElementsByTagName('iframe')[0]
	if (iframe && iframe.contentWindow) {
		iframe.contentWindow.postMessage(JSON.stringify(dataToPublish), '*')
	}
}

const pubsubFactory = (window: BrowserWindow): IPubsub => {
	function getEvent(appDefId: string, eventName: string) {
		const empty = {
			persistentData: [],
			listeners: {},
		}
		if (!hub[appDefId]) {
			hub[appDefId] = {
				[eventName]: empty,
			}
		} else if (!hub[appDefId][eventName]) {
			hub[appDefId][eventName] = empty
		}
		return hub[appDefId][eventName]
	}

	return {
		publish(
			appDefId: string,
			compId: string,
			msgData: { eventKey: string; isPersistent: boolean; eventData: any }
		) {
			const eventKeyStripped = stripPubSubPrefix(msgData.eventKey)
			const isPersistent = msgData.isPersistent
			const event = getEvent(appDefId, eventKeyStripped)
			const eventListeners = event.listeners
			Object.keys(eventListeners).forEach((targetCompId) =>
				eventListeners[targetCompId].forEach((listener) =>
					listener({ data: msgData.eventData, name: eventKeyStripped, origin: compId })
				)
			)

			if (isPersistent) {
				const dataToPersist = msgData.eventData
				event.persistentData.push({ name: eventKeyStripped, data: dataToPersist })
			}
		},
		subscribe(
			appDefId: string,
			compId: string,
			msgData: { eventKey: string; isPersistent: boolean },
			callback: Function
		) {
			const eventName = stripPubSubPrefix(msgData.eventKey)
			const event = getEvent(appDefId, eventName)
			if (!event.listeners[compId]) {
				event.listeners[compId] = [callback]
			} else if (compId === 'worker') {
				event.listeners[compId].push(callback)
			}

			if (msgData.isPersistent) {
				if (event.persistentData.length) {
					callback({ data: event.persistentData[0].data, name: eventName, origin: compId }, true)
				}
			}
		},
		unsubscribe(appDefId: string, compId: string, eventKey: string) {
			const event = getEvent(appDefId, stripPubSubPrefix(eventKey))
			delete event.listeners[compId]
		},
		handleIframeSubscribe(appDefinitionId: string, compId: string, { eventKey, isPersistent, callId }) {
			this.subscribe(
				appDefinitionId,
				compId,
				{
					eventKey,
					isPersistent,
				},
				(eventData: any, isTriggeredImmediately: boolean = false) => {
					const dataToPublish = isTriggeredImmediately
						? {
								intent: 'TPA_RESPONSE',
								callId,
								type: 'registerEventListener',
								res: {
									drain: true,
									data: [eventData],
								},
								status: true,
								compId,
						  }
						: {
								eventType: eventKey,
								intent: 'addEventListener',
								params: eventData,
						  }
					sendToIframe(compId, dataToPublish, window)
				}
			)
		},
	}
}

export const Pubsub = withDependencies([BrowserWindowSymbol], pubsubFactory)

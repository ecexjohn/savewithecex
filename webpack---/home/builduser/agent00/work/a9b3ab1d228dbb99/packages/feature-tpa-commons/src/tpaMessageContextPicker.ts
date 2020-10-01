import { optional, withDependencies } from '@wix/thunderbolt-ioc'
import { IAppDidMountHandler, IStructureAPI, StructureAPI, Props, IPropsStore } from '@wix/thunderbolt-symbols'
import { ITpaContextMapping, ITpaHandlersManager, TpaIncomingMessage } from './types'
import { IPageProvider, PageProviderSymbol } from 'feature-pages'
import { TpaContextMappingSymbol, TpaHandlersManagerSymbol } from './symbols'
import { WindowMessageRegistrarSymbol, IWindowMessageRegistrar } from 'feature-window-message-registrar'
import { TbDebugSymbol, DebugApis } from 'feature-debug'

const parseMessage = (evt: any) => {
	if (evt.data) {
		try {
			return JSON.parse(evt.data)
		} catch (e) {}
	}
	return {}
}

const isTpaMessage = (msg: TpaIncomingMessage<any>) => msg && ['TPA', 'TPA2'].includes(msg.intent)

const editorOnlyHandlers = ['getWixUpgradeUrl', 'stylesReady', 'getViewModeInternal', 'setHelpArticle']

/**
 * This object's purpose is to comb through incoming window messages and assign TPA messages to the TpaHandler
 * instance in the correct IOC container (e.g the container that has the message sending component).
 */
export const TpaMessageContextPicker = withDependencies(
	[
		WindowMessageRegistrarSymbol,
		PageProviderSymbol,
		TpaContextMappingSymbol,
		StructureAPI,
		Props,
		optional(TbDebugSymbol),
	],
	(
		windowMessageRegistrar: IWindowMessageRegistrar,
		pageProvider: IPageProvider,
		tpaContextMapping: ITpaContextMapping,
		structureApi: IStructureAPI,
		props: IPropsStore,
		debugApi?: DebugApis
	): IAppDidMountHandler => {
		const getHandlersManagerForPage = async (pageId: string): Promise<ITpaHandlersManager> => {
			const pageRef = await pageProvider(pageId)
			return pageRef.getAllImplementersOnPageOf<ITpaHandlersManager>(TpaHandlersManagerSymbol)[0]
		}

		const getMessageSourceContainerId = ({ compId }: TpaIncomingMessage<any>): string | undefined | null => {
			if (!compId) {
				return
			}

			// getTpaComponentContextId() for persistent popups and chat in responsive
			// getContextIdOfCompId() to seek compId in structure if compId does not belong to tpa/ooi widget (i.e any random iframe with the js-sdk installed, e.g tpa galleries)
			return tpaContextMapping.getTpaComponentContextId(compId) || structureApi.getContextIdOfCompId(compId)
		}

		return {
			appDidMount() {
				windowMessageRegistrar.addWindowMessageHandler({
					canHandleEvent(event: MessageEventInit) {
						return !!(event.source && isTpaMessage(parseMessage(event)))
					},
					async handleEvent(event: MessageEventInit) {
						const msg = parseMessage(event)
						const { type, callId } = msg

						if (editorOnlyHandlers.includes(type)) {
							return
						}

						const contextId = getMessageSourceContainerId(msg)

						// If its a responsive chat, the value passed in compId is the template id
						// For the chat to work properly we need to map it to the real viewer comp id (inflated)
						// But we need to do it after the context was mapped
						const compIdFromTemplate = tpaContextMapping.getTpaComponentIdFromTemplate(msg.compId)

						const messageWithCorrectCompId = { ...msg, compId: compIdFromTemplate ?? msg.compId }
						const { compId } = messageWithCorrectCompId

						if (debugApi) {
							debugApi.tpa.addMessage({ msg: messageWithCorrectCompId, compId, contextId })
						}
						if (!contextId) {
							console.error('TPA handler message caller does not belong to any page', {
								type,
								callId,
								compId,
							})
							return
						}

						const pageHandlersManager = await getHandlersManagerForPage(contextId)

						pageHandlersManager.handleMessage(event.source as any, messageWithCorrectCompId).catch((e) => {
							console.error('TpaHandlerError', type, contextId, compId, e)
						})
					},
				})
			},
		}
	}
)

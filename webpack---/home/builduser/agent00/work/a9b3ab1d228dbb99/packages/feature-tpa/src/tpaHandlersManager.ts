import { withDependencies, named, multi, optional } from '@wix/thunderbolt-ioc'
import {
	BrowserWindowSymbol,
	ILogger,
	LoggerSymbol,
	PageFeatureConfigSymbol,
	pageIdSym,
	TpaHandlerExtras,
	TpaHandlerProvider,
	TpaHandlerProviderSymbol,
	TpaHandlers,
} from '@wix/thunderbolt-symbols'
import { BaseResponse, TpaPageConfig } from './types'
import { name } from './symbols'
import { ITpaHandlersManager, TpaIFrame } from 'feature-tpa-commons'
import { runtimeTpaCompIdBuilder } from '@wix/thunderbolt-commons'
import { TbDebugSymbol, DebugApis } from 'feature-debug'
import { TpaWorkerSymbol, ITpaWorker } from 'feature-tpa-worker'

export const TpaHandlersManager = withDependencies(
	[
		BrowserWindowSymbol,
		named(PageFeatureConfigSymbol, name),
		multi(TpaHandlerProviderSymbol),
		LoggerSymbol,
		pageIdSym,
		optional(TpaWorkerSymbol),
		optional(TbDebugSymbol),
	],
	(
		window: Window,
		tpaPageConfig: TpaPageConfig,
		handlerProviders: Array<TpaHandlerProvider>,
		logger: ILogger,
		pageId: string,
		tpaWorker?: ITpaWorker,
		debugApi?: DebugApis
	): ITpaHandlersManager => {
		const sendResponseTPA = ({
			tpa,
			callId,
			status,
			res,
			compId,
		}: {
			tpa: TpaIFrame
			callId: string
			status: boolean
			res: any
			compId: string
		}) => {
			const msg: BaseResponse<any> = {
				callId,
				intent: 'TPA_RESPONSE',
				status,
				res,
			}
			if (debugApi) {
				debugApi.tpa.addMessage({ msg, compId, contextId: pageId })
			}
			tpa.postMessage(JSON.stringify(msg), '*')
		}

		const handlers: TpaHandlers = Object.assign(
			{},
			...handlerProviders.map((provider) => provider.getTpaHandlers())
		)

		const getTpaWorkerAppDefinitionId = (compId: string) => {
			if (tpaWorker?.isTpaWorker(compId)) {
				return tpaWorker!.getAppDefinitionId(compId)
			}
			return null
		}

		return {
			async handleMessage(tpa, { type, callId, compId, data }) {
				const handler = handlers[type]
				const originCompId = runtimeTpaCompIdBuilder.getOriginCompId(compId)
				const appDefinitionId =
					tpaPageConfig.widgets[originCompId]?.appDefinitionId ||
					getTpaWorkerAppDefinitionId(originCompId) ||
					''
				const widgetId = tpaPageConfig.widgets[originCompId]?.widgetId || ''

				if (!handler) {
					console.error(`TpaHandlerError: ${type} handler is not implemented`)
					logger.captureError(new Error('TPA handler is not implemented'), {
						tags: { feature: 'tpa', handlerName: type, appDefinitionId },
						extras: {
							handlerName: type,
							compId,
							originCompId,
							appDefinitionId,
							widgetId,
						},
					})
					return
				}

				const extras: TpaHandlerExtras = {
					callId,
					tpa,
					appDefinitionId,
					widgetId,
					originCompId,
				}

				const result = handler(compId, data, extras)
				if (typeof result === 'undefined') {
					// TODO rethink this. it's a very weird way of saying:
					// if the handler returns a promise or some defined value,
					// someone in the iframe is waiting for a response. otherwise return.
					return
				}

				try {
					const res = await result
					sendResponseTPA({ tpa, callId, compId, status: true, res })
				} catch (e) {
					sendResponseTPA({
						tpa,
						callId,
						compId,
						status: false,
						res: { message: e.message, name: e.name, stack: e.stack },
					})
				}
			},
		}
	}
)

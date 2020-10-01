import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	BusinessLogger,
	BusinessLoggerSymbol,
	CurrentRouteInfoSymbol,
	SiteFeatureConfigSymbol,
	TpaHandlerProvider,
	WixBiSession,
	WixBiSessionSymbol,
} from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { runtimeTpaCompIdBuilder } from '@wix/thunderbolt-commons'
import { ICurrentRouteInfo } from 'feature-router'

export type MessageData = { stageNum: number; stage: string }
export type HandlerResponse = void

export const ApplicationLoadingStepHandler = withDependencies(
	[BusinessLoggerSymbol, named(SiteFeatureConfigSymbol, tpaCommonsName), WixBiSessionSymbol, CurrentRouteInfoSymbol],
	(
		businessLogger: BusinessLogger,
		{ debug }: TpaCommonsSiteConfig,
		wixBiSession: WixBiSession,
		currentRouteInfo: ICurrentRouteInfo
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				applicationLoadingStep(compId, msgData: MessageData, { appDefinitionId, widgetId }): HandlerResponse {
					if (runtimeTpaCompIdBuilder.isRuntimeCompId(compId)) {
						if (debug) {
							console.warn(`applicationLoadingStep is ignored in runtime component ${compId}`)
						}
						return
					}

					const routeInfo = currentRouteInfo.getCurrentRouteInfo()

					const now = Date.now()
					const tts = now - wixBiSession.initialRequestTimestamp
					const { stage, stageNum } = msgData
					businessLogger.logger.log(
						{
							appId: appDefinitionId,
							widget_id: widgetId,
							instance_id: compId,
							src: 42,
							// APP_LOADED_PARTIALLY
							evid: 644,
							tts,
							pid: routeInfo ? routeInfo.pageId : null,
							stage,
							stageNum,
						},
						{ endpoint: 'ugc-viewer' }
					)
				},
			}
		},
	})
)

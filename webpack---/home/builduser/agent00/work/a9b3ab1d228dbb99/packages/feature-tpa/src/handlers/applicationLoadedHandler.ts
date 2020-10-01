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

export type MessageData = {}
export type HandlerResponse = void

export const ApplicationLoadedHandler = withDependencies(
	[BusinessLoggerSymbol, named(SiteFeatureConfigSymbol, tpaCommonsName), WixBiSessionSymbol, CurrentRouteInfoSymbol],
	(
		businessLogger: BusinessLogger,
		{ debug }: TpaCommonsSiteConfig,
		wixBiSession: WixBiSession,
		currentRouteInfo: ICurrentRouteInfo
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				applicationLoaded(compId, _msgData, { appDefinitionId, widgetId }): HandlerResponse {
					if (runtimeTpaCompIdBuilder.isRuntimeCompId(compId)) {
						if (debug) {
							console.warn(`applicationLoaded is ignored in runtime component ${compId}`)
						}
						return
					}

					const routeInfo = currentRouteInfo.getCurrentRouteInfo()

					const now = Date.now()
					const tts = now - wixBiSession.initialRequestTimestamp
					businessLogger.logger.log(
						{
							appId: appDefinitionId,
							widget_id: widgetId,
							instance_id: compId,
							src: 42,
							// APP_LOADED_SUCCESSFULLY
							evid: 643,
							tts,
							pid: routeInfo ? routeInfo.pageId : null,
						},
						{ endpoint: 'ugc-viewer' }
					)
				},
			}
		},
	})
)

import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { pageIdSym, SiteFeatureConfigSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type GetComponentInfoResponse = {
	compId: string
	showOnAllPages: boolean
	pageId: string
	tpaWidgetId?: string
	appPageId?: string
}

export const GetComponentInfoHandler = withDependencies(
	[pageIdSym, named(SiteFeatureConfigSymbol, tpaCommonsName)],
	(pageId: string, { widgetsClientSpecMapData }: TpaCommonsSiteConfig): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getComponentInfo(compId, msgData, { widgetId }): GetComponentInfoResponse {
					const showOnAllPages = pageId === 'masterPage'
					return {
						compId,
						showOnAllPages,
						pageId: showOnAllPages ? '' : pageId,
						tpaWidgetId: widgetsClientSpecMapData[widgetId].tpaWidgetId,
						appPageId: widgetsClientSpecMapData[widgetId].appPage?.id || '',
					}
				},
			}
		},
	})
)

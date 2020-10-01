import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type MessageData = { appDefinitionId: string }
export type HandlerResponse = string | null

export const GetAppVendorProductIdHandler = withDependencies(
	[named(SiteFeatureConfigSymbol, tpaCommonsName)],
	({ appsClientSpecMapData }: TpaCommonsSiteConfig): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getAppVendorProductId(_compId, { appDefinitionId }: MessageData): HandlerResponse {
					const encodedInstance = appsClientSpecMapData[appDefinitionId]?.appFields?.instance?.replace(
						/^[^.]+./,
						''
					)
					if (!encodedInstance) {
						return null
					}

					const vendorProductId = JSON.parse(atob(encodedInstance))?.vendorProductId
					return vendorProductId
				},
			}
		},
	})
)

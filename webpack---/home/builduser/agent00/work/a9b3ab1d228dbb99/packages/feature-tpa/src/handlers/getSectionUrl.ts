import _ from 'lodash'
import { name } from '../symbols'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { TpaPageConfig, TpaMasterPageConfig } from '../types'
import {
	PageFeatureConfigSymbol,
	MasterPageFeatureConfigSymbol,
	TpaHandlerProvider,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type GetSectionUrlResponse = any

export type MessageData = {
	sectionIdentifier: string
}

export const GetSectionUrlHandler = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
	],
	(
		{ externalBaseUrl, appsClientSpecMapByApplicationId }: TpaCommonsSiteConfig,
		{ widgets }: TpaPageConfig,
		{ pagesData }: TpaMasterPageConfig
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getSectionUrl(compId, { sectionIdentifier }: MessageData, { originCompId }): GetSectionUrlResponse {
					const page = _.find(pagesData, { tpaPageId: sectionIdentifier })
					if (page?.id) {
						return { url: `${externalBaseUrl}/${page.pageUriSEO}` }
					} else {
						const { applicationId } = widgets[originCompId]
						const { appDefinitionName } = appsClientSpecMapByApplicationId[applicationId]
						return {
							error: {
								message: `Page with app "${appDefinitionName}" was not found.`,
							},
						}
					}
				},
			}
		},
	})
)

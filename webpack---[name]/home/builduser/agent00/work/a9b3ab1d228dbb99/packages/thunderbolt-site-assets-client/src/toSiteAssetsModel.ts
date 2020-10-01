import { MetaSiteModel, SitePagesModel } from 'site-assets-client'
import { DataFixersParams, Experiments, SiteScopeParams } from '@wix/thunderbolt-symbols'

const experimentsAsRecord = (experiments: Experiments) =>
	Object.assign(
		{},
		...Object.entries(experiments).map(([key, value]) => {
			return {
				[key]: `${value}`,
			}
		})
	)

export function toMetaSiteModel(dataFixersParams: DataFixersParams, siteScopeParam: SiteScopeParams): MetaSiteModel {
	const { isHttps, isUrlMigrated, metaSiteId, siteId } = dataFixersParams
	return {
		clientSpecMap: siteScopeParam.anonymousClientSpecMap,
		isHttps,
		isUrlMigrated,
		metaSiteId,
		siteId,
		csmCacheKey: siteScopeParam.csmCacheKey,
	}
}

export function toSitePagesModel(dataFixersParams: DataFixersParams, siteScopeParam: SiteScopeParams): SitePagesModel {
	const { dfVersion, ck, experiments, quickActionsMenuEnabled, v, siteRevision } = dataFixersParams
	const { pageJsonFileNames, protectedPageIds, routersInfo, urlFormatModel } = siteScopeParam

	return {
		dataFixerVersion: dfVersion,
		dataFixerCacheVersion: ck,
		experiments: experimentsAsRecord(experiments),
		pageJsonFileNames,
		protectedPageIds,
		quickActionsMenuEnabled,
		routersInfo,
		siteRevision,
		urlFormatModel,
		v,
	}
}

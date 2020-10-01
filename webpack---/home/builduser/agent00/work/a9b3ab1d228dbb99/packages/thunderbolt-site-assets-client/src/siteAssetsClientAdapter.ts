import {
	FallbackStrategy,
	MetaSiteModel,
	SiteAssetsClient,
	siteAssetsClientBuilder,
	SiteAssetsCollaborators,
	SiteAssetsSiteModels,
	SitePagesModel,
} from 'site-assets-client'
import {
	ProcessLevelSACFactoryParams,
	RequestLevelSACFactoryParams,
	SiteAssetsClientAdapter,
	TBSiteAssetsRequest,
} from './types'
import { toSiteAssetsRequest } from './toSiteAssetsRequest'
import { toMetaSiteModel, toSitePagesModel } from './toSiteAssetsModel'
import { nopSiteAssetsMetricsReporter } from './nopSiteAssetsMetricsReporter'
import { toSiteAssetsHttpClient } from './toSiteAssetsHttpClient'

export const createSiteAssetsClientAdapter = ({
	fetchFn,
	config,
	siteAssetsMetricsReporter = nopSiteAssetsMetricsReporter(),
	manifests,
	moduleFetcher,
	onFailureDump = () => {},
}: ProcessLevelSACFactoryParams) => ({
	dataFixersParams,
	requestUrl,
	siteScopeParams,
	beckyExperiments,
	fallbackOverride,
	staticHTMLComponentUrl,
	remoteWidgetStructureBuilderVersion,
	deviceInfo,
	qaMode,
}: RequestLevelSACFactoryParams): SiteAssetsClientAdapter => {
	const collaborators: SiteAssetsCollaborators = {
		httpClient: toSiteAssetsHttpClient(requestUrl, fetchFn, config.moduleTopology.environment.siteAssetsServerUrl),
		moduleFetcher,
		metricsReporter: siteAssetsMetricsReporter,
	}

	const sitePagesModel: SitePagesModel = toSitePagesModel(dataFixersParams, siteScopeParams)
	const metaSiteModel: MetaSiteModel = toMetaSiteModel(dataFixersParams, siteScopeParams)

	const siteAssetsSiteModels: SiteAssetsSiteModels = {
		sitePagesModel,
		metaSiteModel,
	}

	const siteAssetsClient: SiteAssetsClient = siteAssetsClientBuilder(collaborators, config, siteAssetsSiteModels)

	return {
		// result() returns a (Promise of) string or json depending on the content-type of the module output
		execute(request: TBSiteAssetsRequest, fallbackStrategy: FallbackStrategy): Promise<string | any> {
			return siteAssetsClient
				.execute(
					toSiteAssetsRequest(
						request,
						manifests.node.modulesToHashes,
						sitePagesModel.pageJsonFileNames,
						fallbackOverride ? fallbackOverride : fallbackStrategy,
						siteScopeParams,
						beckyExperiments,
						staticHTMLComponentUrl,
						remoteWidgetStructureBuilderVersion,
						deviceInfo,
						qaMode
					)
				)
				.catch((e) => {
					const moduleName = request.moduleParams.moduleName
					const pageCompId = request.pageCompId
					onFailureDump({
						siteAssetsFailureMessage: e.message,
						moduleName,
						pageCompId,
						// add here as many data as you like
					})
					throw e
				})
				.then(({ result }) => result())
		},
		calcPublicModuleUrl(request: TBSiteAssetsRequest): string {
			return siteAssetsClient.getPublicUrl(
				toSiteAssetsRequest(
					request,
					manifests.node.modulesToHashes,
					sitePagesModel.pageJsonFileNames,
					/* TODO not relevant */ 'disable',
					siteScopeParams,
					beckyExperiments,
					staticHTMLComponentUrl,
					remoteWidgetStructureBuilderVersion,
					deviceInfo,
					qaMode
				)
			)
		},
		getInitConfig() {
			return config
		},
	}
}

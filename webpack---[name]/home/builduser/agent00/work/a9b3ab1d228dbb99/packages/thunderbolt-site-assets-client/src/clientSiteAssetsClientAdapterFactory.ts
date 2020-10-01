import { createSiteAssetsClientAdapter } from './siteAssetsClientAdapter'
import { FetchFn, SiteAssetsClientTopology, ViewerModel } from '@wix/thunderbolt-symbols'
import {
	SiteAssetsClientConfig,
	SiteAssetsMetricsReporter,
	SiteAssetsModuleFetcher,
	SiteAssetsTopology,
} from 'site-assets-client'

import {
	ClientSACFactoryParams,
	SiteAssetsClientAdapter,
	ToRequestLevelSACFactoryParamsFromSpreadedViewerModel,
} from './types'
import { Environment, getFallbackOverrideStrategy, shouldRouteStagingRequest } from './configResolvers'

const toSiteAssetsTopology = (clientTopology: SiteAssetsClientTopology): SiteAssetsTopology => {
	const {
		mediaRootUrl,
		staticMediaUrl,
		htmlComponentsDomainUrl,
		siteAssetsUrl,
		moduleRepoUrl,
		fileRepoUrl,
	} = clientTopology

	return {
		mediaRootUrl,
		staticMediaUrl,
		htmlComponentsDomainUrl,
		siteAssetsServerUrl: siteAssetsUrl,
		moduleRepoUrl,
		fileRepoUrl,
	}
}

export const toClientSACFactoryParams = ({
	viewerModel,
	fetchFn,
	siteAssetsMetricsReporter,
	env,
	moduleFetcher,
}: {
	viewerModel: ViewerModel
	fetchFn: FetchFn
	siteAssetsMetricsReporter: SiteAssetsMetricsReporter
	env: Environment
	moduleFetcher: SiteAssetsModuleFetcher
}) => {
	const {
		experiments,
		requestUrl,
		siteAssets,
		fleetConfig,
		deviceInfo,
		mode: { qa: qaMode },
	} = viewerModel

	return toClientSACFactoryParamsFrom({
		siteAssets,
		env,
		deviceInfo,
		qa: qaMode,
		experiments,
		requestUrl,
		isStagingRequest: shouldRouteStagingRequest(fleetConfig),
		fetchFn,
		siteAssetsMetricsReporter,
		moduleFetcher,
	})
}

export const toClientSACFactoryParamsFrom = ({
	siteAssets,
	requestUrl,
	env,
	qa,
	deviceInfo,
	experiments,
	fetchFn,
	siteAssetsMetricsReporter,
	moduleFetcher,
	isStagingRequest,
}: ToRequestLevelSACFactoryParamsFromSpreadedViewerModel & {
	isStagingRequest?: boolean
	moduleFetcher: SiteAssetsModuleFetcher
	siteAssetsMetricsReporter: SiteAssetsMetricsReporter
	fetchFn: FetchFn
}) => {
	const {
		clientTopology,
		manifests,
		dataFixersParams,
		siteScopeParams,
		beckyExperiments,
		staticHTMLComponentUrl,
		remoteWidgetStructureBuilderVersion,
	} = siteAssets

	return {
		fetchFn,
		clientTopology,
		siteAssetsMetricsReporter,
		manifests,
		timeout: 4000,
		dataFixersParams,
		requestUrl,
		siteScopeParams,
		moduleFetcher,
		isStagingRequest,
		fallbackOverride: getFallbackOverrideStrategy(experiments, env),
		beckyExperiments,
		staticHTMLComponentUrl,
		remoteWidgetStructureBuilderVersion,
		deviceInfo,
		qaMode: qa,
	}
}

export const createClientSAC = ({
	fetchFn,
	clientTopology,
	siteAssetsMetricsReporter,
	manifests,
	timeout,
	dataFixersParams,
	requestUrl,
	siteScopeParams,
	moduleFetcher,
	isStagingRequest,
	fallbackOverride,
	beckyExperiments,
	staticHTMLComponentUrl,
	remoteWidgetStructureBuilderVersion,
	deviceInfo,
	qaMode,
}: ClientSACFactoryParams): SiteAssetsClientAdapter => {
	const topology = toSiteAssetsTopology(clientTopology)
	const config: SiteAssetsClientConfig = {
		moduleTopology: {
			publicEnvironment: topology,
			environment: topology,
		},
		staticsTopology: {
			timeout,
			baseURLs: clientTopology.pageJsonServerUrls,
		},
		isStagingRequest,
		artifactId: 'wix-thunderbolt-client',
	}

	return createSiteAssetsClientAdapter({
		fetchFn,
		config,
		siteAssetsMetricsReporter,
		manifests,
		moduleFetcher,
	})({
		dataFixersParams,
		requestUrl,
		siteScopeParams,
		fallbackOverride,
		beckyExperiments,
		staticHTMLComponentUrl,
		remoteWidgetStructureBuilderVersion,
		deviceInfo,
		qaMode,
	})
}

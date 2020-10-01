import smoothscroll from 'smoothscroll-polyfill'
import { createLogger } from './features/logger/logger'
import { BIReporterImpl } from './features/bi/bi'
import { ThunderboltInitializerImpl } from './init/initThunderbolt'
import { fixViewport } from './lib/fixViewport'
import './assets/scss/viewer.global.scss' // Only import it so it will be written in manifest.json
import { FetchApi } from './features/client-fetch/client-fetch'
import { featuresLoaders } from './featureLoaders'
import { instance as biInstance } from './bi-module/instance'
import { IThunderboltClient } from './features/thunderbolt/IThunderbolt'
import { createFeaturesLoader } from '@wix/thunderbolt-features'
import { clientModuleFetcher, createClientSAC, toClientSACFactoryParams } from 'thunderbolt-site-assets-client'
import { tbElementComponents } from './componentLibraries'
import { BeatEventType } from '@wix/thunderbolt-symbols'
import { ClientFetchCache } from './features/client-fetch/fetch-cache'
import { fedopsMetricsReporter, taskify } from '@wix/thunderbolt-commons'
import { createDomReadyPromise } from './features/thunderbolt/DomReady'
import { Hub } from '@sentry/types'
import { Environment } from './types/Environment'
import { Container } from '@wix/thunderbolt-ioc'
import { ClientRenderResponse } from 'feature-react-renderer'

taskify(() => smoothscroll.polyfill())

const { viewerModel, Sentry } = window
const fetchFn = window.fetch

const reportBI = biInstance.reportBI.bind(biInstance)
const sendBeat = biInstance.sendBeat.bind(biInstance)
const setDynamicSessionData = biInstance.setDynamicSessionData.bind(biInstance)
const reportPageNavigation = biInstance.reportPageNavigation.bind(biInstance)
const reportPageNavigationDone = biInstance.reportPageNavigationDone.bind(biInstance)

reportBI('main loaded') // TODO: Report using logger

const runThunderbolt = async () => {
	await Promise.resolve(window.onBeforeStart)
	const { experiments, viewMode, requestUrl } = viewerModel

	const logger = await taskify(() =>
		createLogger({
			sentry: (Sentry as unknown) as Hub,
			wixBiSession: biInstance.wixBiSession,
			viewerModel,
			fetch: fetchFn,
		})
	)

	const biReporter = BIReporterImpl(
		reportBI,
		sendBeat,
		setDynamicSessionData,
		reportPageNavigation,
		reportPageNavigationDone
	)
	// ORDER DOES MATTER!!! DO NOT CHANGE!!!
	const componentLibraries = window.ThunderboltElementsLoaded.then(() =>
		Promise.all([tbElementComponents(require('thunderbolt-elements'))])
	)

	const getWarmupData = () => JSON.parse(document.getElementById('warmup-data')?.textContent || '{}')

	const { siteAssets } = viewerModel
	const environment: Environment = {
		wixBiSession: biInstance.wixBiSession,
		viewerModel,
		biReporter,
		siteAssetsClient: createClientSAC(
			toClientSACFactoryParams({
				viewerModel,
				env: 'client',
				fetchFn,
				siteAssetsMetricsReporter: fedopsMetricsReporter(logger),
				moduleFetcher: clientModuleFetcher(fetchFn, siteAssets.clientTopology, {
					thunderbolt: siteAssets.manifests,
					tbElements: siteAssets.tbElementsManifests,
				}),
			})
		),
		fetchApi: FetchApi(requestUrl, fetchFn, ClientFetchCache()),
		specificEnvFeaturesLoaders: createFeaturesLoader(featuresLoaders, { experiments }),
		componentLibraries,
		logger,
		experiments,
		browserWindow: window,
		warmupData: createDomReadyPromise().then(getWarmupData),
	}

	const thunderboltInitializer = ThunderboltInitializerImpl(new Container())

	thunderboltInitializer.loadEnvironment(environment)

	const rendererPromise = taskify(async () => {
		logger.phaseMark('load renderer')
		return thunderboltInitializer.getRenderer<ClientRenderResponse>()
	})

	const renderer = await taskify(async () => {
		logger.phaseMark('load site features')
		await thunderboltInitializer.loadSiteFeatures()
		return rendererPromise
	})

	const thunderboltClient = await taskify(async () => {
		logger.phaseMark('init Thunderbolt')
		return (await thunderboltInitializer.getThunderboltInvoker<IThunderboltClient>())()
	})

	const { firstPageId } = await taskify(async () => {
		logger.phaseMark('client render')
		await renderer.render()
		return thunderboltClient.appDidMount()
	})

	if (viewMode === 'mobile') {
		await taskify(() => fixViewport())
	}
	biReporter.sendBeat(BeatEventType.PAGE_FINISH, 'page interactive', { pageId: firstPageId })
	logger.appLoaded()
}

runThunderbolt()

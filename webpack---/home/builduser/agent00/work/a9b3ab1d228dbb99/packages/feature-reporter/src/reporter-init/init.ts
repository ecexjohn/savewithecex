import { LoadedScripts } from '../tag-manager/types'
import { ReporterEvent, ReporterState, IReporterApi, ReporterSiteConfig } from '..'
import { getReporterProps } from './get-reporter-props'
import { WixBiSession, BusinessLogger } from '@wix/thunderbolt-symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { setState } from '../utils'
import { onTagManagerReady } from '../tag-manager'

export async function init(
	reporterApi: IReporterApi,
	siteConfig: ReporterSiteConfig,
	wixBiSession: WixBiSession,
	businessLogger: BusinessLogger,
	featureState: IFeatureState<ReporterState>
) {
	const reporterProps = getReporterProps(siteConfig, wixBiSession)
	const api = await import('../api' /* webpackChunkName: "reporter-api" */)
	api.initListeners(reporterProps)

	const initChannels = (loadedScripts: LoadedScripts) => {
		api.initChannels(reporterProps, loadedScripts, businessLogger)
		setState(featureState, { isAdapterInitialized: true })
		const { pendingEvents } = featureState.get()
		pendingEvents.forEach((event: ReporterEvent) => reporterApi.trackEvent(event))
		setState(featureState, { pendingEvents: [] })
	}

	onTagManagerReady(initChannels)
}

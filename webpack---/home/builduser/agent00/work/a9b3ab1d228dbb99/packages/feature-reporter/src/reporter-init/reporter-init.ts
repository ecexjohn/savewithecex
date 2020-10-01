import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	WixBiSessionSymbol,
	FeatureStateSymbol,
	SiteFeatureConfigSymbol,
	BusinessLoggerSymbol,
} from '@wix/thunderbolt-symbols'
import { IReporterInit, ReporterState } from '../types'
import { ReporterSymbol, name } from '../symbols'
import { setState } from '../utils'
import { init } from './init'

const initialState: ReporterState = {
	isAdapterInitialized: false,
	pendingEvents: [],
	pageNumber: 1,
}

const reporterInit: IReporterInit = (reporterApi, featureState, siteConfig, wixBiSession, businessLogger) => ({
	async appWillMount() {
		setState(featureState, initialState)

		const shouldInitReporter = !wixBiSession.suppressbi
		if (shouldInitReporter) {
			init(reporterApi, siteConfig, wixBiSession, businessLogger, featureState)
		}
	},
})

export const ReporterInit = withDependencies(
	[
		ReporterSymbol,
		named(FeatureStateSymbol, name),
		named(SiteFeatureConfigSymbol, name),
		WixBiSessionSymbol,
		BusinessLoggerSymbol,
	],
	reporterInit
)

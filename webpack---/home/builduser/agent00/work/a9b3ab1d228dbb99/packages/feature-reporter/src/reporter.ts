import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { IReporterApi, ReporterState } from './types'
import { IFeatureState } from 'thunderbolt-feature-state'

import { name } from './symbols'
import { FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import { setState } from './utils'

const reporterFactory = (featureState: IFeatureState<ReporterState>): IReporterApi => ({
	trackEvent: async (event) => {
		const { isAdapterInitialized } = featureState.get() || {}
		if (isAdapterInitialized) {
			const { eventName, params, options } = event
			const api = await import('./api' /* webpackChunkName: "reporter-api" */)
			api.trackEvent(eventName, params, options)
		} else {
			const pendingEvents = (featureState.get().pendingEvents || []).push(event)
			setState(featureState, pendingEvents)
		}
	},
})

export const Reporter = withDependencies([named(FeatureStateSymbol, name)], reporterFactory)

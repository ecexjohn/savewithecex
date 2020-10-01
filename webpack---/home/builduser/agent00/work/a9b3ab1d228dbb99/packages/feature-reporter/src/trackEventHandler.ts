import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { ReporterSymbol } from './symbols'
import { IReporterApi } from './types'

export type MessageData = {
	eventName: string
	params: object
	options: object
}

export const TrackEventHandler = withDependencies(
	[optional(ReporterSymbol)],
	(reporterFeature?: IReporterApi): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				trackEvent(compId, { eventName, params, options }: MessageData): void {
					const event = { eventName, params, options }
					return reporterFeature?.trackEvent(event)
				},
			}
		},
	})
)

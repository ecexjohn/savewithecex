import { channelNames } from '@wix/promote-analytics-adapter'
import { BusinessLogger } from '@wix/thunderbolt-symbols'
import { decorateReporter } from './decorateReporter'
import { BiProps } from './types'

const PROMOTE_BI_ENDPOINT = 'pa'

export const getDefaultChannels = (biProps: BiProps, businessLogger: BusinessLogger) => {
	return [
		{
			name: channelNames.BI_ANALYTICS,
			report: decorateReporter(biProps, channelNames.BI_ANALYTICS, (params: any) => {
				businessLogger.logger.log(params, { endpoint: PROMOTE_BI_ENDPOINT })
			}),
		},
	]
}

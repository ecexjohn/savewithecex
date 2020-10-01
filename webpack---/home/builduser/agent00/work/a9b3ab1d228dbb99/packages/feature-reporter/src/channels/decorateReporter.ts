import { channelNames } from '@wix/promote-analytics-adapter'
import { BiProps } from './types'

export function decorateReporter(biProps: BiProps, name: string, reportFn: Function) {
	const biChannels = [channelNames.WIX_ANALYTICS, channelNames.BI_ANALYTICS]
	return biChannels.includes(name) ? enrichWithBiProps(biProps, reportFn) : reportFn
}

function enrichWithBiProps(biProps: any, reportFn: Function) {
	return (params: any) => {
		params = {
			...params,
			uuid: biProps.userId,
			url: window.document.location.href,
			ref: window.document.referrer,
		}

		return reportFn(params)
	}
}

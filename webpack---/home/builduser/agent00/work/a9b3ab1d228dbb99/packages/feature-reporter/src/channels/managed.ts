import { channelNames } from '@wix/promote-analytics-adapter'

export const getManagedChannels = () => [
	{
		name: channelNames.FACEBOOK_PIXEL,
		report: (eventType: string, eventName: string, data = {}) => invoke(window, 'fbq', eventType, eventName, data),
	},
	{
		name: channelNames.GOOGLE_ANALYTICS,
		report() {
			invoke(window, 'ga', ...arguments)
		},
	},
	{
		name: channelNames.GOOGLE_TAG_MANAGER,
		report: (eventParams: any) => Array.isArray(window.dataLayer) && window.dataLayer.push(...eventParams),
	},
	{
		name: channelNames.YANDEX_METRICA,
		report: () => invoke(window.ym, 'hit', window.document.location.href),
	},
]

function invoke(container: any, funcName: string, ...args: any) {
	container && typeof container[funcName] === 'function' && container[funcName](...args)
}

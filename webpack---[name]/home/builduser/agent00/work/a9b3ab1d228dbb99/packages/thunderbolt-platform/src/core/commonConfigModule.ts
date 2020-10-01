import { BootstrapData } from '../types'
import { CommonConfig } from '@wix/thunderbolt-symbols'

declare const self: {
	commonConfig: BootstrapData['commonConfig']
}

export type ICommonConfigModule = {
	registerToChange: (handler: (commonConfig: CommonConfig) => void) => void
	get: () => CommonConfig
}

export default function(bootstrapData: BootstrapData, createSdkHandlers: (pageId: string) => any): ICommonConfigModule {
	const sdkHandlers = createSdkHandlers(bootstrapData.currentPageId)
	const subscribers: Array<(commonConfig: CommonConfig) => void> = []

	if (process.env.browser) {
		sdkHandlers.registerToCommonConfigChange((newCommonConfig: CommonConfig) => {
			self.commonConfig = newCommonConfig
			subscribers.forEach((subscriber) => subscriber(newCommonConfig))
		})
	}

	return {
		registerToChange: (handler) => subscribers.push(handler),
		get: () => self.commonConfig
	}
}

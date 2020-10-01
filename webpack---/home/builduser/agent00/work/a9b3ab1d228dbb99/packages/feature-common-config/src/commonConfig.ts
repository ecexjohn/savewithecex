import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BIReporter,
	BISymbol,
	CommonConfig,
	SiteFeatureConfigSymbol,
	BrowserWindowSymbol,
	BrowserWindow,
} from '@wix/thunderbolt-symbols'
import { ICommonConfig, ICommonConfigState } from './types'
import { name } from './symbols'
import { isSSR } from '@wix/thunderbolt-commons'

const commonConfigFactory = (
	initialCommonConfig: CommonConfig,
	biReporter: BIReporter,
	window: BrowserWindow
): ICommonConfig => {
	const state: ICommonConfigState = {
		commonConfig: initialCommonConfig,
		subscribers: [],
	}

	return {
		getCommonConfig: () => state.commonConfig,
		updateCommonConfig: (config: Partial<CommonConfig>) => {
			if (config.hasOwnProperty('bsi')) {
				biReporter.setDynamicSessionData({ bsi: config.bsi })
			}
			state.commonConfig = { ...state.commonConfig, ...config }
			state.subscribers.forEach((subscriber) => subscriber(state.commonConfig))

			if (!isSSR(window)) {
				window!.commonConfig = state.commonConfig
			}
		},
		registerToCommonConfigChange: (subscriber) => state.subscribers.push(subscriber),
	}
}

export const CommonConfigImpl = withDependencies(
	[named(SiteFeatureConfigSymbol, name), BISymbol, BrowserWindowSymbol],
	commonConfigFactory
)

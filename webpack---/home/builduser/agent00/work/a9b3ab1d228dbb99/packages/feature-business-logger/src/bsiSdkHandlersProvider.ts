import { withDependencies } from '@wix/thunderbolt-ioc'

import { BsiManagerSymbol } from './symbols'
import { IBsiManager } from './types'

// This handler is for report that activity (bi report) was made in the worker in order to extend bsi
const bsiSdkHandlersProviderFactory = (bsiManager: IBsiManager) => {
	return {
		getSdkHandlers: () => ({
			reportActivity: bsiManager.reportActivity,
		}),
	}
}

export const bsiSdkHandlersProvider = withDependencies([BsiManagerSymbol], bsiSdkHandlersProviderFactory)

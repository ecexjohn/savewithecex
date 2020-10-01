import { withDependencies } from '@wix/thunderbolt-ioc'
import { ViewerModelSym, ViewerModel, IAppWillMountHandler } from '@wix/thunderbolt-symbols'
import { Router as RouterSymbol } from './symbols'
import { IUrlHistoryPopStateHandler, IRouter } from './types'

export const RouterInitAppWillMount = withDependencies(
	[RouterSymbol, ViewerModelSym],
	(router: IRouter, viewerModel: ViewerModel): IAppWillMountHandler => ({
		appWillMount: async () => {
			await router.navigate(viewerModel.requestUrl)
		},
	})
)

export const RouterInitOnPopState = withDependencies(
	[RouterSymbol],
	(router: IRouter): IUrlHistoryPopStateHandler => ({
		onPopState: async (url) => {
			await router.navigate(url.href)
		},
	})
)

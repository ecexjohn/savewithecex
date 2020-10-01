import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol, CurrentRouteInfoSymbol, Experiments, ExperimentsSymbol, PlatformEnvDataProvider } from '@wix/thunderbolt-symbols'
import { ICurrentRouteInfo, UrlHistoryManagerSymbol, IUrlHistoryManager } from 'feature-router'
import { getBrowserLanguage, getBrowserReferrer, isSSR } from '@wix/thunderbolt-commons'
import _ from 'lodash'

export const locationEnvDataProvider = withDependencies(
	[CurrentRouteInfoSymbol, UrlHistoryManagerSymbol],
	(currentRouteInfo: ICurrentRouteInfo, urlHistoryManager: IUrlHistoryManager): PlatformEnvDataProvider => {
		return {
			get platformEnvData() {
				const routeInfo = currentRouteInfo.getCurrentRouteInfo()
				const rawUrl = urlHistoryManager.getParsedUrl().href
				const routerData = routeInfo?.dynamicRouteData
				return {
					location: {
						rawUrl
					},
					routerData
				}
			}
		}
	}
)

export const windowEnvDataProvider = withDependencies(
	[BrowserWindowSymbol],
	(window: BrowserWindow): PlatformEnvDataProvider => ({
		platformEnvData: {
			window: {
				isSSR: isSSR(window),
				browserLocale: getBrowserLanguage(window)
			}
		}
	})
)

export const documentEnvDataProvider = withDependencies(
	[BrowserWindowSymbol],
	(window: BrowserWindow): PlatformEnvDataProvider => ({
		platformEnvData: {
			document: {
				referrer: getBrowserReferrer(window)
			}
		}
	})
)

export const experimentsEnvDataProvider = withDependencies(
	[ExperimentsSymbol],
	(experiments: Experiments): PlatformEnvDataProvider => ({
		// TODO temp until we'll do a little refactor and remove experiments from bootstrap data in favor of experiments in the platform env data
		platformEnvData: { experiments: _.pick(experiments, ['specs.thunderbolt.GetSiteStructurePreventAutoPageIdRetrieval']) }
	})
)

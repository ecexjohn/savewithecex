import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindowSymbol, BrowserWindow, IPageDidUnmountHandler } from '@wix/thunderbolt-symbols'
import { isSSR } from '@wix/thunderbolt-commons'
import { UrlHistoryManagerSymbol, IUrlHistoryManager } from 'feature-router'

const scrollRestorationFactory = (
	browserWindow: BrowserWindow,
	urlHistoryManager: IUrlHistoryManager
): IPageDidUnmountHandler => {
	return {
		pageDidUnmount() {
			if (!isSSR(browserWindow)) {
				const state = urlHistoryManager.getHistoryState()

				if (state && state.scrollY) {
					urlHistoryManager.updateHistoryState(null, 'manual')
					browserWindow.scrollTo(0, state.scrollY)
					urlHistoryManager.updateHistoryState(null, 'auto')
				} else {
					browserWindow.scrollTo(0, 0)
				}
			}
		},
	}
}

export const ScrollRestoration = withDependencies(
	[BrowserWindowSymbol, UrlHistoryManagerSymbol],
	scrollRestorationFactory
)

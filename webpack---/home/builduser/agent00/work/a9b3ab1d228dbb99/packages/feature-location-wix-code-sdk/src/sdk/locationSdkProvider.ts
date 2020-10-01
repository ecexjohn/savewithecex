import { withDependencies } from '@wix/thunderbolt-ioc'
import { SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { INavigation, NavigationSymbol } from 'feature-navigation'
import { IUrlHistoryManager, UrlHistoryManagerSymbol, IUrlChangeHandler } from 'feature-router'

export const locationWixCodeSdkHandlersProvider = withDependencies(
	[NavigationSymbol, UrlHistoryManagerSymbol],
	(navigation: INavigation, urlHistoryManager: IUrlHistoryManager): SdkHandlersProvider<any> & IUrlChangeHandler => {
		const onChangeHandlers: Array<Function> = []

		return {
			getSdkHandlers: () => ({
				navigateTo: navigation.navigateTo,
				pushUrlState: (href: string): void => {
					const url = new URL(href)
					urlHistoryManager.pushUrlState(url)
				},
				registerLocationSdkOnChangeHandler: (handler: Function) => {
					onChangeHandlers.push(handler)
				},
			}),
			onUrlChange: async (url) => {
				onChangeHandlers.forEach((handler) => handler(url.href))
			},
		}
	}
)

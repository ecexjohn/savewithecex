import { ContainerModuleLoader, withDependencies } from '@wix/thunderbolt-ioc'
import { SiteMembersApi } from './siteMembersApi'
import { SiteMembersApiSymbol } from './symbols'
import { SiteMembersSiteConfig } from './types'
import { TpaHandlerProviderSymbol, LifeCycle, IPageWillUnmountHandler } from '@wix/thunderbolt-symbols'
import { SiteMembersTPAHandlers } from './tpaHandlers'

export const site: ContainerModuleLoader = (bind, bindAll) => {
	bindAll([SiteMembersApiSymbol, LifeCycle.AppWillMountHandler, LifeCycle.AppDidMountHandler], SiteMembersApi)
}

export const page: ContainerModuleLoader = (bind) => {
	bind(TpaHandlerProviderSymbol).to(SiteMembersTPAHandlers)
	bind(LifeCycle.PageWillUnmountHandler).to(
		// This is in order to get the same instance that was created above
		withDependencies<IPageWillUnmountHandler>(
			[SiteMembersApiSymbol],
			(siteMembersApi: IPageWillUnmountHandler) => ({
				pageWillUnmount(pageInfo) {
					return siteMembersApi.pageWillUnmount(pageInfo)
				},
			})
		)
	)
}

export { SiteMembersApiSymbol, SiteMembersSiteConfig }
export { BIEvents } from './biEvents'
export { PrivacyStatus, INTERACTIONS } from './constants'
export * from './types'
export { memberDetailsFromDTO } from './utils'

import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { SessionManagerSymbol, DynamicSessionModelSymbol, name } from './symbols'
import { SessionManager as ClientSessionManager } from './clientSessionManager'
import { SessionManager as ServerSessionManager } from './serverSessionManager'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'

export const site: ContainerModuleLoader = (bind, bindAll) => {
	if (process.env.browser) {
		bindAll([SessionManagerSymbol, WixCodeSdkHandlersProviderSym], ClientSessionManager)
	} else {
		bind(SessionManagerSymbol).to(ServerSessionManager)
	}
}

export { ISessionManager, DynamicSessionModel, SessionHandlers, Instance } from './types'

export { SessionManagerSymbol, DynamicSessionModelSymbol, name }

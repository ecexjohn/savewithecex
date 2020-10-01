import { PlatformUtils } from '@wix/thunderbolt-symbols'
import { namespace, RealtimeWixCodeSdkWixCodeApi } from '..'
import { realtime } from './realtime'
import { Environment } from './environment'

type RealtimeNamespace = { [namespace]: RealtimeWixCodeSdkWixCodeApi }

export function RealtimeSdkFactory(_: any, __: any, platformUtils: PlatformUtils): RealtimeNamespace {
	const environment = new Environment(platformUtils.wixCodeNamespacesRegistry)
	const duplexerSocketsServiceUrl = 'apps.wix.com/wix-duplexer-sockets-server'

	return {
		[namespace]: realtime(duplexerSocketsServiceUrl, environment),
	}
}

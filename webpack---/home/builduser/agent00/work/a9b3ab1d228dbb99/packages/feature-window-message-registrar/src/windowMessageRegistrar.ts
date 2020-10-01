import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindowSymbol } from '@wix/thunderbolt-symbols'
import { IWindowMessageRegistrar, MessageRegistrarWindow, WindowMessageConsumer } from './types'

export const WindowMessageRegistrar = withDependencies(
	[BrowserWindowSymbol],
	(window: MessageRegistrarWindow): IWindowMessageRegistrar => {
		return {
			addWindowMessageHandler(handler: WindowMessageConsumer) {
				window._addWindowMessageHandler!(handler)
			},
		}
	}
)

import { namespace, WixStoresWixCodeSdkWixCodeApi } from '..'
import { PlatformUtils, PlatformEnvData } from '@wix/thunderbolt-symbols'
import { WixStoresSdk } from './WixStoresSdk'
import { createFedopsLogger } from '@wix/thunderbolt-commons'

export function WixStoresSdkFactory(
	_: any,
	__: any,
	{ sessionServiceApi, biUtils, appsPublicApisUtils }: PlatformUtils,
	{ bi: biData }: PlatformEnvData
): { [namespace]: WixStoresWixCodeSdkWixCodeApi } {
	const biLoggerFactory = biUtils.createBiLoggerFactoryForFedops(biData)
	const fedopsLogger = createFedopsLogger({
		biLoggerFactory,
		phasesConfig: 'SEND_START_AND_FINISH',
		appName: 'wixstores-wix-code-sdk',
	})

	const wixStoresSdk = new WixStoresSdk(sessionServiceApi, fedopsLogger, appsPublicApisUtils)

	return {
		[namespace]: {
			async getProductOptionsAvailability(
				productId: string,
				options: { [key: string]: string } = {}
			): Promise<any> {
				return wixStoresSdk.getProductOptionsAvailability(productId, options)
			},
			async getProductVariants(productId: string, options: { [key: string]: string } = {}): Promise<any> {
				return wixStoresSdk.getProductVariants(productId, options)
			},
			async getCurrentCart(): Promise<any> {
				return wixStoresSdk.getCurrentCart()
			},
			onCartChanged(handler: (cart: any) => void) {
				wixStoresSdk.onCartChanged(handler)
			},
		},
	}
}

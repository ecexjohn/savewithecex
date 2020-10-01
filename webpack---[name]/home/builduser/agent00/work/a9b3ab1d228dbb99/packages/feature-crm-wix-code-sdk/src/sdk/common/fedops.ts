import { PlatformEnvData, PlatformUtils } from '@wix/thunderbolt-symbols'
import { createFedopsLogger as createCommonFedopsLogger } from '@wix/thunderbolt-commons'

export const createFedopsLogger = (biUtils: PlatformUtils['biUtils'], biData: PlatformEnvData['bi']) => {
	return createCommonFedopsLogger({
		appName: 'crm-wix-code-sdk',
		biLoggerFactory: biUtils.createBiLoggerFactoryForFedops(biData),
		customParams: {
			viewerName: 'thunderbolt',
		},
	})
}

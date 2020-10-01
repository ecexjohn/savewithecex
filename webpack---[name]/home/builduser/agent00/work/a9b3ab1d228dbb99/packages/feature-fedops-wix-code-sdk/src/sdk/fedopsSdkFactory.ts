import { BaseLogger, create as createFedopsLogger, ICreateOptions } from '@wix/fedops-logger'
import { Factory } from '@wix/web-bi-logger/dist/src/logger' // eslint-disable-line no-restricted-syntax
import { PlatformEnvData, PlatformUtils } from '@wix/thunderbolt-symbols'
import { FedopsWixCodeSdkSiteConfig, FedopsWixCodeSdkWixCodeApi, namespace } from '..'

export const FedopsSdkFactory = (
	config: FedopsWixCodeSdkSiteConfig,
	_: any,
	{ biUtils }: PlatformUtils,
	{ bi: biData }: PlatformEnvData
): { [namespace]: FedopsWixCodeSdkWixCodeApi } => {
	return {
		[namespace]: {
			create(appName: string, params: Partial<ICreateOptions>): BaseLogger<any> {
				if (config.isWixSite) {
					const biLoggerFactory: Factory = biUtils.createBiLoggerFactoryForFedops(biData)
					const paramsWithLoggerFactory: Partial<ICreateOptions> = {
						...params,
						biLoggerFactory,
					}
					return createFedopsLogger(appName, paramsWithLoggerFactory)
				}
				throw new Error('Fedops is only usable in a site that is marked as a WixSite')
			},
		},
	}
}

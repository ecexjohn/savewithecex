import { FedopsLogger } from '@wix/fedops-logger'
import { createFedopsLogger } from '@wix/thunderbolt-commons'
import { platformBiLoggerFactory } from '../../bi/biLoggerFactory'
import { BootstrapData } from '../../../types'
import { PlatformEnvData } from '@wix/thunderbolt-symbols'

export const createFedopsLoggerFactory = ({
	biData,
	platformServicesBiData,
	viewMode
}: {
	biData: PlatformEnvData['bi']
	platformServicesBiData: BootstrapData['platformServicesAPIData']['bi']
	viewMode: 'site' | 'preview'
}): FedopsLogger =>
	createFedopsLogger({
		biLoggerFactory: platformBiLoggerFactory.createBiLoggerFactoryForFedops(biData),
		customParams: {
			isMobileFriendly: platformServicesBiData.isMobileFriendly,
			viewerName: 'thunderbolt',
			viewMode
		}
	})

import { platformBiLoggerFactory } from '../../bi/biLoggerFactory'
import { BootstrapData } from '../../../types'
import { BsiManager } from '../../bsiManagerModule'
import { PlatformEnvData } from '@wix/thunderbolt-symbols'

/**
 * BI logger factory for Viewer Platform Apps
 *
 * - Initialized with base defaults + app defaults.
 * - Any additional defaults should be added only after making sure the BI schema supports them
 *
 * Please use #bi-logger-support for any questions
 */
const createBiLoggerFactoryForApp = ({
	appDefinitionId,
	instanceId,
	biData,
	platformServicesBiData,
	bsiManager,
	viewMode
}: {
	appDefinitionId: string
	instanceId: string
	biData: PlatformEnvData['bi']
	platformServicesBiData: BootstrapData['platformServicesAPIData']['bi']
	bsiManager: BsiManager
	viewMode: 'site' | 'preview'
}) => () =>
	platformBiLoggerFactory.createBaseBiLoggerFactory(biData).updateDefaults({
		_appId: appDefinitionId,
		_instanceId: instanceId,
		_siteOwnerId: platformServicesBiData.ownerId,
		_viewMode: viewMode,
		bsi: () => bsiManager.getBsi()
	})

export const platformAppBiLoggerFactory = {
	createBiLoggerFactoryForApp
}

import { commonBiLoggerFactory } from '@wix/thunderbolt-commons'
import { PlatformEnvData } from '@wix/thunderbolt-symbols'

const createBiLoggerFactory = ({
	biData,
	endpoint,
	factoryCreator
}: {
	biData: PlatformEnvData['bi']
	endpoint?: string
	factoryCreator: typeof commonBiLoggerFactory[keyof typeof commonBiLoggerFactory]
}) => {
	const {
		msId: msid,
		visitorId,
		siteMemberId,
		viewerSessionId,
		requestId,
		initialTimestamp,
		initialRequestTimestamp,
		dc,
		is_rollout,
		isCached,
		rolloutData,
		pageData,
		viewerVersion,
		muteBi
	} = biData

	const biStore = {
		msid,
		visitorId,
		siteMemberId,
		viewerSessionId,
		requestId,
		initialTimestamp,
		initialRequestTimestamp,
		dc,
		is_rollout,
		isCached,
		rolloutData,
		pageData,
		viewerVersion,
		is_headless: false
	}
	return factoryCreator({ biStore, muteBi, endpoint, fetch: self.fetch })
}

/**
 * Base BI logger factory, should be used as a basis for any BI logger in the Viewer Platform
 *
 * - Initialized with base defaults.
 * - Any additional defaults should be added via specialized factories, like FedOps,
 *   and only after making sure the BI schema supports them.
 *
 * Please use #bi-logger-support for any questions
 */
const createBaseBiLoggerFactory = (biData: PlatformEnvData['bi'], endpoint?: string) => {
	return createBiLoggerFactory({ biData, endpoint, factoryCreator: commonBiLoggerFactory.createBaseBiLoggerFactory })
}

/**
 * BI logger factory for Viewer Platform FedOps
 *
 * - Initialized with base defaults + defaults which are supported by FedOps BI events
 *   https://bo.wix.com/bi-catalog-webapp/#/sources/72
 *
 * - Any additional defaults should be added only after making sure the BI schema supports them
 *
 * Please use #bi-logger-support for any questions
 */
const createBiLoggerFactoryForFedops = (biData: PlatformEnvData['bi']) => {
	return createBiLoggerFactory({ biData, factoryCreator: commonBiLoggerFactory.createBiLoggerFactoryForFedops })
}

export const platformBiLoggerFactory = {
	createBaseBiLoggerFactory,
	createBiLoggerFactoryForFedops
}

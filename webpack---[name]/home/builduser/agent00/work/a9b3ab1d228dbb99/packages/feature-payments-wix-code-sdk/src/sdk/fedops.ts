import { PlatformEnvData, PlatformUtils } from '@wix/thunderbolt-symbols'
import { createFedopsLogger as createCommonFedopsLogger } from '@wix/thunderbolt-commons'

const ALE = 'load'
const ALE_KICKOFF = 'load-phase-kickoff'

export const createFedopsLogger = (biUtils: PlatformUtils['biUtils'], biData: PlatformEnvData['bi']) => {
	const logger = createCommonFedopsLogger({
		biLoggerFactory: biUtils.createBiLoggerFactoryForFedops(biData),
		customParams: {
			viewerName: 'thunderbolt',
		},
	})

	return {
		logALE() {
			logger.interactionStarted(ALE)
			logger.interactionStarted(ALE_KICKOFF)
		},
	}
}

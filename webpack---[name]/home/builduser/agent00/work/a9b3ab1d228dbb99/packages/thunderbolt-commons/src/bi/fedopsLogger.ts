import { presetsTypes } from '@wix/fedops-presets'
import { FedopsLogger, create } from '@wix/fedops-logger'
import { FedopsConfig } from '@wix/thunderbolt-symbols'

export const createFedopsLogger = ({
	biLoggerFactory,
	customParams = {},
	phasesConfig = 'SEND_ON_FINISH',
	appName = 'thunderbolt',
	presetType = presetsTypes.BOLT,
	reportBlackbox = false,
}: FedopsConfig): FedopsLogger =>
	create(appName, {
		presetType,
		phasesConfig,
		isPersistent: true,
		isServerSide: !process.env.browser,
		reportBlackbox,
		customParams,
		biLoggerFactory,
	})

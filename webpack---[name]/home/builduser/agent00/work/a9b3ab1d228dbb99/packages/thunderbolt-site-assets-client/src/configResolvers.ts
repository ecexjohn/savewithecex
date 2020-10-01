import { FleetConfig } from '@wix/thunderbolt-ssr-api'
import { Experiments } from '@wix/thunderbolt-symbols'
import { FallbackStrategy } from 'site-assets-client'

export const shouldRouteStagingRequest = (fleetConfig: FleetConfig) => {
	return ['Stage', 'DeployPreview', 'Canary'].includes(fleetConfig.type)
}

export type Environment = 'client' | 'node' | 'ssrWorker' | 'clientWorker'

export const getFallbackOverrideStrategy = (
	experiments: Experiments,
	env: Environment
): FallbackStrategy | undefined => {
	const isExpOn = (exp: string) => experiments[exp] === true

	switch (env) {
		case 'client': {
			if (isExpOn('specs.thunderbolt.shouldDisableSACFallbackForClient')) {
				return 'disable'
			} else {
				break
			}
		}
		case 'node': {
			if (isExpOn('specs.thunderbolt.shouldDisableSACFallbackForNode')) {
				return 'disable'
			} else {
				break
			}
		}
		case 'ssrWorker': {
			if (isExpOn('specs.thunderbolt.shouldDisableSACFallbackForSsrWorker')) {
				return 'disable'
			} else {
				break
			}
		}
		case 'clientWorker': {
			if (isExpOn('specs.thunderbolt.shouldDisableSACFallbackForClientWorker')) {
				return 'disable'
			} else {
				break
			}
		}
		default: {
			return undefined
		}
	}
}

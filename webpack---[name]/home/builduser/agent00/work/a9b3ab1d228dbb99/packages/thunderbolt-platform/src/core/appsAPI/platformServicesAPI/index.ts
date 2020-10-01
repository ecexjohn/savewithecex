import { PlatformServicesAPI, Experiments, PlatformEnvData } from '@wix/thunderbolt-symbols'
import { BootstrapData } from '../../../types'
import { biFactory } from './bi'
import { createFedopsLoggerFactory } from './fedopsLogger'
import { platformAppBiLoggerFactory } from './biLoggerFactory'
import { monitoringFactory } from './monitoring'
import { reportTraceFactory } from './reportTrace'
import { BsiManager } from '../../bsiManagerModule'

type createPlatformAppServicesApiParams = {
	documentData: PlatformEnvData['document']
	biData: PlatformEnvData['bi']
	appDefinitionId: string
	instanceId: string
	platformServicesAPIData: BootstrapData['platformServicesAPIData']
	experiments: Experiments
	csrfToken: string
	bsiManager: BsiManager
}

export const createPlatformAppServicesApi = ({
	documentData,
	biData,
	appDefinitionId,
	instanceId,
	platformServicesAPIData,
	experiments,
	csrfToken,
	bsiManager
}: createPlatformAppServicesApiParams): PlatformServicesAPI => {
	const platformServicesBiData = platformServicesAPIData.bi
	const viewMode = platformServicesBiData.isPreview ? ('preview' as const) : ('site' as const)

	const bi = biFactory({ biData, platformServicesBiData, viewMode })
	const biLoggerFactory = platformAppBiLoggerFactory.createBiLoggerFactoryForApp({ appDefinitionId, instanceId, biData, platformServicesBiData, bsiManager, viewMode })
	const reportTrace = reportTraceFactory({ biData, experiments, appDefinitionId })
	const fedOpsLoggerFactory = createFedopsLoggerFactory({ biData, platformServicesBiData, viewMode })
	const monitoring = monitoringFactory({ url: biData.pageData.pageUrl, viewMode, viewerVersion: biData.viewerVersion, referrer: documentData.referrer })

	return {
		getCsrfToken: () => csrfToken,
		bi,
		biLoggerFactory,
		reportTrace,
		fedOpsLoggerFactory,
		monitoring
	}
}

import _ from 'lodash'
import { platformBiLoggerFactory } from '../../bi/biLoggerFactory'
import { Experiments, PlatformEnvData } from '@wix/thunderbolt-symbols'

export const reportTraceFactory = ({ biData, experiments, appDefinitionId }: { biData: PlatformEnvData['bi']; experiments: Experiments; appDefinitionId: string }) => {
	if (!experiments.sv_reportTrace) {
		return _.noop
	}

	/**
	 * Trace event logger.
	 *
	 * Please don't add any additional fields unless they are defined in the BI schema
	 * https://bo.wix.com/bi-catalog-webapp/#/sources/72/events/100?artifactId=trace.artifact.id
	 */
	const logger = platformBiLoggerFactory
		.createBaseBiLoggerFactory(biData)
		.updateDefaults({
			appName: appDefinitionId,
			src: 72,
			evid: 100
		})
		.logger({ endpoint: 'trace' })

	return ({ actionName = 'noop', tracePosition = 'none', actionDurationMs = 0, message = '' } = {}) =>
		logger.log({
			timestampMs: Date.now(),
			timeFromStartMs: Date.now() - _.get(biData, 'ssrRequestTimestamp', biData.initialTimestamp),
			actionName,
			message,
			actionDurationMs,
			tracePosition
		})
}

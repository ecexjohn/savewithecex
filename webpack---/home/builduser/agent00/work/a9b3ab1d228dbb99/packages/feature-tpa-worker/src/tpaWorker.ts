import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	IAppDidMountHandler,
	IPropsStore,
	IStructureAPI,
	Props,
	SiteFeatureConfigSymbol,
	StructureAPI,
} from '@wix/thunderbolt-symbols'
import { TpaSrcBuilderSymbol, ITpaSrcBuilder, TpaContextMappingSymbol, ITpaContextMapping } from 'feature-tpa-commons'
import { name } from './symbols'
import { ITpaWorker, TpaWorkerSiteConfig } from './types'

export const TPA_WORKER_PREFIX = 'tpaWorker'

type CreateWorkerArgs = {
	applicationId: string
	appDefinitionId: string
	appWorkerUrl: string
	appDefinitionName: string
}

export const TpaWorkerFactory = withDependencies(
	[named(SiteFeatureConfigSymbol, name), StructureAPI, Props, TpaSrcBuilderSymbol, TpaContextMappingSymbol],
	(
		{ tpaWorkers }: TpaWorkerSiteConfig,
		structureApi: IStructureAPI,
		props: IPropsStore,
		tpaSrcBuilder: ITpaSrcBuilder,
		tpaContextMapping: ITpaContextMapping
	): IAppDidMountHandler & ITpaWorker => {
		const tpaWorkerCompIdRegex = new RegExp(`^${TPA_WORKER_PREFIX}_([0-9]+)$`)

		const createWorker = async ({
			applicationId,
			appDefinitionId,
			appWorkerUrl,
			appDefinitionName,
		}: CreateWorkerArgs): Promise<string> => {
			const workerId = `${TPA_WORKER_PREFIX}_${applicationId}`
			tpaContextMapping.registerTpasForContext('masterPage', [workerId])
			props.update({
				[workerId]: {
					title: appDefinitionName,
					src: tpaSrcBuilder.buildSrc(workerId, 'masterPage', {}, appWorkerUrl, {
						extraQueryParams: {
							endpointType: 'worker',
						},
						appDefinitionId,
					}),
				},
			})

			await structureApi.addComponentToDynamicStructure(workerId, {
				components: [],
				componentType: 'TPAWorker',
			})
			return workerId
		}

		const isTpaWorker = (compId: string) => tpaWorkerCompIdRegex.test(compId)

		return {
			async appDidMount() {
				return Promise.all(
					Object.entries(tpaWorkers).map(([applicationId, workerData]) =>
						createWorker({ applicationId, ...workerData })
					)
				)
			},
			getAppDefinitionId(compId) {
				const applicationId = tpaWorkerCompIdRegex.exec(compId)?.[1]
				return tpaWorkers[applicationId!]?.appDefinitionId || null
			},
			isTpaWorker,
		}
	}
)

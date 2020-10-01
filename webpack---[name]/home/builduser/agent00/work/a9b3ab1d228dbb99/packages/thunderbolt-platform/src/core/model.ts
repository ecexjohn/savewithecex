import _ from 'lodash'
import { PlatformModel, SiteAssetsResourceType, PlatformLogger, Connection } from '@wix/thunderbolt-symbols'
import { SiteAssetsClientAdapter } from 'thunderbolt-site-assets-client'
import { BootstrapData } from '../types'
import { RawModel, FeaturesResponse, Model } from './types'
import { MasterPageId } from './constants'
import { errorPagesIds } from '@wix/thunderbolt-commons'
import RenderedAPI from './renderedService'

export default function({ bootstrapData, logger, siteAssetsClient, handlers }: { bootstrapData: BootstrapData; logger: PlatformLogger; siteAssetsClient: SiteAssetsClientAdapter; handlers: any }) {
	const fetchModel = <T>(resourceType: SiteAssetsResourceType, isMasterPage: boolean): Promise<T> =>
		logger.runAsyncAndReport(`getModel_${resourceType}${isMasterPage ? `_${MasterPageId}` : ''}`, () => {
			const pageCompId = isMasterPage ? MasterPageId : `${bootstrapData.currentPageId}`
			const isErrorPage = !!errorPagesIds[pageCompId]
			const errorPageData = isErrorPage ? { pageCompId: isErrorPage ? 'masterPage' : pageCompId, errorPageId: pageCompId } : {}
			const pageJsonFileNames = bootstrapData.siteAssetsClientInitParams.siteScopeParams.pageJsonFileNames
			const pageJsonFileName = isMasterPage || isErrorPage ? pageJsonFileNames[MasterPageId] : pageJsonFileNames[pageCompId]
			// TODO - handle/catch site-assets client error
			logger.captureBreadcrumb({
				message: 'fetchModel',
				category: 'model',
				data: {
					moduleParams: bootstrapData.siteAssetsClientInitParams.modulesParams[resourceType],
					pageCompId,
					isErrorPage,
					errorPageData,
					pageJsonFileName,
					pageJsonFileNames,
					isMasterPage,
					'bootstrapData-pageJsonFileName': bootstrapData.pageJsonFileName
				}
			})
			return siteAssetsClient.execute(
				{
					moduleParams: bootstrapData.siteAssetsClientInitParams.modulesParams[resourceType],
					pageCompId,
					...errorPageData,
					pageJsonFileName: pageJsonFileName || bootstrapData.pageJsonFileName
				},
				'disable'
			)
		})

	function mergeConnections(masterPageConnections: PlatformModel['connections'], pageConnections: PlatformModel['connections']) {
		// merge connection arrays
		return _.mergeWith(pageConnections, masterPageConnections, (objValue, srcValue) => (_.isArray(objValue) ? objValue.concat(srcValue) : undefined))
	}

	const getModelFromSiteAssetsResponses = (isMasterPage: boolean, [platformModel, featuresModel]: [PlatformModel, FeaturesResponse]) => {
		const {
			props: pageConfig,
			structure: { components: structureModel }
		} = featuresModel
		const { connections, applications, orderedControllers, onLoadProperties } = platformModel
		const propsModel = pageConfig.render.compProps

		return {
			pageConfig,
			propsModel,
			structureModel,
			rawPageStructure: isMasterPage ? {} : structureModel,
			rawMasterPageStructure: isMasterPage ? structureModel : {},
			platformModel: {
				connections,
				applications,
				orderedControllers,
				sdkData: platformModel.sdkData,
				staticEvents: platformModel.staticEvents,
				compIdConnections: platformModel.compIdConnections,
				containersChildrenIds: platformModel.containersChildrenIds,
				compIdToRepeaterId: platformModel.compIdToRepeaterId,
				onLoadProperties,
				controllerCompIdToAppDefinitionId: platformModel.controllerCompIdToAppDefinitionId
			}
		}
	}

	const fetchPageModel = (pageType: 'masterPage' | 'page') => {
		const isMasterPage = pageType === 'masterPage'
		return Promise.all([fetchModel<PlatformModel>('platform', isMasterPage), fetchModel<FeaturesResponse>('features', isMasterPage)]).then((result) =>
			getModelFromSiteAssetsResponses(isMasterPage, result)
		)
	}

	const getRawModel = async () => {
		const pageModelPromise = fetchPageModel('page')
		if (bootstrapData.platformEnvData.bi.pageData.isLightbox) {
			return pageModelPromise
		}

		const masterPageModelPromise = fetchPageModel('masterPage')
		const [pageModel, masterPageModel] = await Promise.all([pageModelPromise, masterPageModelPromise])

		const pageConfig = _.merge({}, masterPageModel.pageConfig, pageModel.pageConfig)
		const connections = mergeConnections(masterPageModel.platformModel.connections, pageModel.platformModel.connections)
		const onLoadProperties = _.merge({}, masterPageModel.platformModel.onLoadProperties, pageModel.platformModel.onLoadProperties)
		const structureModel = _.assign({}, masterPageModel.structureModel, pageModel.structureModel)
		const applications = _.merge({}, masterPageModel.platformModel.applications, pageModel.platformModel.applications)
		const sdkData = _.assign({}, masterPageModel.platformModel.sdkData, pageModel.platformModel.sdkData)
		const staticEvents = _.concat(masterPageModel.platformModel.staticEvents, pageModel.platformModel.staticEvents)
		const compIdConnections = _.assign({}, masterPageModel.platformModel.compIdConnections, pageModel.platformModel.compIdConnections)
		const containersChildrenIds = _.assign({}, masterPageModel.platformModel.containersChildrenIds, pageModel.platformModel.containersChildrenIds)
		const compIdToRepeaterId = _.assign({}, masterPageModel.platformModel.compIdToRepeaterId, pageModel.platformModel.compIdToRepeaterId)
		const orderedControllers = masterPageModel.platformModel.orderedControllers.concat(pageModel.platformModel.orderedControllers)
		const propsModel = pageConfig.render.compProps
		const controllerCompIdToAppDefinitionId = _.merge({}, masterPageModel.platformModel.controllerCompIdToAppDefinitionId, pageModel.platformModel.controllerCompIdToAppDefinitionId)
		return {
			pageConfig,
			propsModel,
			structureModel,
			rawPageStructure: pageModel.rawPageStructure,
			rawMasterPageStructure: masterPageModel.rawMasterPageStructure,
			platformModel: {
				connections,
				applications,
				orderedControllers,
				sdkData,
				staticEvents,
				compIdConnections,
				containersChildrenIds,
				onLoadProperties,
				compIdToRepeaterId,
				controllerCompIdToAppDefinitionId
			}
		}
	}

	const getAPIsOverModel = (model: RawModel) => {
		const getPageIdByCompId = (compId: string) => (model.rawMasterPageStructure[compId] ? MasterPageId : bootstrapData.currentPageId)
		const getCompIdByWixCodeNickname = (nickname: string) => _.get(model.platformModel.connections, ['wixCode', nickname, 0, 'compId'])
		const getParentId = (compId: string) => _.findKey(model.structureModel, ({ components }) => components && components.includes(compId))
		const getCompType = (compId: string) => model.structureModel[compId].componentType
		const getControllerTypeByCompId = (compId: string) => {
			const appControllers = _.find(model.platformModel.applications, (controllers) => !!controllers[compId])
			return _.get(appControllers, [compId, 'controllerType'], '')
		}
		const getRepeaterIdByCompId = (compId: string) => model.platformModel.compIdToRepeaterId[compId]
		const renderedServiceApi = RenderedAPI({ model, getCompType, getParentId })
		const getRoleForCompId = (compId: string, controllerCompId: string) =>
			_.findKey(model.platformModel.connections[controllerCompId], (connections: Array<Connection>) => connections.some((connection: Connection) => connection.compId === compId))

		return {
			getRoleForCompId,
			getPageIdByCompId,
			getControllerTypeByCompId,
			getCompIdByWixCodeNickname,
			getParentId,
			getCompType,
			getRepeaterIdByCompId,
			isRendered: (compId: string | undefined) => renderedServiceApi.isRendered(compId)
		}
	}

	async function getModel(): Promise<Model> {
		const model = await getRawModel()
		model.platformModel.orderedControllers = ['wixCode', ...model.platformModel.orderedControllers]

		if (!bootstrapData.platformEnvData.window.isSSR) {
			handlers.registerOnPropsChangedHandler(bootstrapData.currentContextId, (changes: { [compId: string]: any }) => {
				_.map(changes, (newProps: any, compId: string) => {
					_.assign(model.propsModel[compId], newProps)
				})
			})
		}

		return {
			...model,
			...getAPIsOverModel(model)
		}
	}

	return {
		getModel
	}
}

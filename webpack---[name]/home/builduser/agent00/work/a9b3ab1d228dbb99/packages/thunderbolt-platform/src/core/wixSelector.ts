import _ from 'lodash'
import { $W, SdkInstance, Connection, PlatformLogger, EventContext, ComponentEventContext } from '@wix/thunderbolt-symbols'
import { SdkFactoryParams } from './createSdkFactoryParams'
import { IControllerEvents } from './ControllerEvents'
import { CompCacheParams, InstanceCacheFactory } from './instanceCache'
import { BootstrapData } from '../types'
import { ComponentSdksManager, Model } from './types'
import instancesObjectFactory from './instancesFactory'
import { getScopedInstancesForRole, getRepeaterScopeContext } from './repeaterUtils'
import { EVENT_CONTEXT_SCOPE } from './constants'

type GetInstanceFunction = (role: string, findOnlyNestedComponents: boolean) => Array<SdkInstance>

export interface WixSelector {
	create$w: (controllerCompId: string) => $W
	getInstance: ({
		controllerCompId,
		compId,
		compType,
		role,
		connection
	}: {
		controllerCompId: string
		compId: string
		compType: string
		role: string
		connection?: Connection
	}) => SdkInstance | Array<SdkInstance> | null
	$wFactory: (controllerId: string, getInstancesForRole: GetInstanceFunction, repeaterId?: string) => $W
	flushOnReadyCallbacks: () => Promise<any>
}

const resolveSelectorType = (rawSelector: string): 'role' | 'nickname' | 'type' => {
	switch (rawSelector[0]) {
		case '@':
			return 'role'
		case '#':
			return 'nickname'
		default:
			return 'type'
	}
}

export default function({
	models,
	getSdkFactoryParams,
	controllerEventsFactory,
	sdkInstancesCache,
	componentSdksManager,
	logger,
	bootstrapData
}: {
	models: Model
	getSdkFactoryParams: SdkFactoryParams['getSdkFactoryParams']
	controllerEventsFactory: IControllerEvents
	sdkInstancesCache: InstanceCacheFactory
	componentSdksManager: ComponentSdksManager
	logger: PlatformLogger
	bootstrapData: BootstrapData
}) {
	const onReadyCallbacks: { [controllerCompId: string]: Array<() => void> } = {}

	// self-exection function, allow caching the calculations of mapping all componentTypes to their sdkType
	const resolveCompTypeForSdkType = (() => {
		const _cache: Record<string, Record<string, boolean>> = {}
		return (sdkType: string, compId: string) => {
			const fromCache = () => {
				const compType = models.getCompType(compId)
				return compType && _cache[sdkType][compType] ? compType : null
			}
			if (_cache[sdkType]) {
				return fromCache()
			}
			_cache[sdkType] = componentSdksManager.getSdkTypeToComponentTypes(sdkType).reduce(
				(result, _compType) => ({
					...result,
					[_compType]: true
				}),
				{} as Record<string, boolean>
			)
			return fromCache()
		}
	})()

	const invokeControllerOnReady = (controllerCompId: string) => {
		// It's possible to have a controller without an onReady Callback, for example wix code without any $w.onReady().
		if (!onReadyCallbacks[controllerCompId]) {
			return Promise.resolve()
		}

		const appDefinitionId = models.platformModel.controllerCompIdToAppDefinitionId[controllerCompId]

		return onReadyCallbacks[controllerCompId].map((onReady) => logger.withReportingAndErrorHandling('controller_page_ready', onReady, { appDefinitionId, controllerType: controllerCompId }))
	}

	const flushOnReadyCallbacks = async () => {
		await componentSdksManager.waitForSdksToLoad()
		return Promise.all(_.flatMap(models.platformModel.orderedControllers, invokeControllerOnReady))
	}

	const getChildrenFn = (compId: string, controllerCompId: string) => {
		const compIdConnections = models.platformModel.compIdConnections
		const containersChildrenIds = models.platformModel.containersChildrenIds
		return () => {
			const childrenIds = containersChildrenIds[compId] || []
			return _.map(childrenIds, (id: string) => {
				const connection = _.get(compIdConnections, [id, controllerCompId])

				return getInstance({
					controllerCompId,
					compId: id,
					compType: models.structureModel[id].componentType,
					role: _.get(connection, 'role', ''),
					connection
				})
			})
		}
	}

	function getInstance({
		controllerCompId,
		compId,
		connection,
		compType,
		role
	}: {
		controllerCompId: string
		compId: string
		compType: string
		connection?: Connection
		role: string
	}): SdkInstance | Array<SdkInstance> | null {
		const compCacheParams: CompCacheParams = {
			controllerCompId,
			compId,
			role
		}
		const instanceFromCache = sdkInstancesCache.getSdkInstance(compCacheParams)
		if (instanceFromCache) {
			return instanceFromCache
		}

		const componentSdkFactory = componentSdksManager.getComponentSdkFactory(compType, { compId, role, controllerCompId })
		if (!componentSdkFactory) {
			return {}
		}
		const sdkFactoryParams = getSdkFactoryParams({
			compId,
			controllerCompId,
			getChildren: getChildrenFn(compId, controllerCompId),
			connection,
			compType,
			role,
			getInstance,
			create$w: () => create$w(controllerCompId)
		})
		const instance = componentSdkFactory(sdkFactoryParams)
		sdkInstancesCache.setSdkInstance(compCacheParams, instance)
		return instance
	}

	function queueOnReadyCallback(onReadyCallback: () => Promise<any>, controllerId: string) {
		onReadyCallbacks[controllerId] = onReadyCallbacks[controllerId] || []
		onReadyCallbacks[controllerId].push(onReadyCallback)
	}

	const createInstancesGetter = (controllerId: string): GetInstanceFunction => (role: string) => {
		const controllerConnectionsByRole = models.platformModel.connections[controllerId] || {} // controller might not have connections
		const connections = controllerConnectionsByRole[role] || []
		return connections.map((connection: Connection) => {
			const compId = connection.compId
			const compFromStructure = models.structureModel[compId]
			if (!compFromStructure) {
				logger.captureError(new Error('$w Error: could not find component in structure'), {
					extra: {
						controllerCompId: controllerId,
						role,
						compId,
						structureModel: models.structureModel,
						connection,
						rawMasterPageStructure: models.rawMasterPageStructure,
						rawPageStructure: models.rawPageStructure,
						currentPageId: bootstrapData.currentPageId,
						currentContextId: bootstrapData.currentContextId
					}
				})
				return {}
			}
			const compType = compFromStructure.componentType
			return getInstance({
				controllerCompId: controllerId,
				compId,
				connection,
				role,
				compType
			})
		})
	}

	const $wDocument = (controllerId: string) => {
		const DocumentSdkFactory = componentSdksManager.getComponentSdkFactory('Document', { compId: 'Document', controllerCompId: controllerId, role: 'Document' })
		if (!DocumentSdkFactory) {
			return
		}
		return DocumentSdkFactory(
			getSdkFactoryParams({
				compId: controllerId,
				controllerCompId: controllerId,
				getChildren: getChildrenFn(controllerId, controllerId),
				compType: 'Document',
				role: 'Document',
				getInstance,
				create$w: () => create$w(controllerId)
			})
		)
	}

	const $wComponent = (
		selector: string,
		controllerId: string,
		{ getInstancesForRole, findOnlyNestedComponents }: { getInstancesForRole: GetInstanceFunction; findOnlyNestedComponents: boolean }
	) => {
		const getInstancesForType = (sdkType: string, connections: Array<Connection>): Array<SdkInstance> => {
			return connections.reduce((instances, connection) => {
				const { compId, role } = connection
				const compType = resolveCompTypeForSdkType(sdkType, compId)
				if (!compType) {
					return instances
				}
				const instance: SdkInstance | Array<SdkInstance> | null = getInstance({
					controllerCompId: controllerId,
					compId,
					connection,
					role,
					compType
				})
				if (_.isArray(instance)) {
					instances.push(...instance)
				} else if (instance) {
					instances.push(instance)
				}
				return instances
			}, [] as Array<SdkInstance>)
		}

		const getComponentInstances = (slctr: string): Array<SdkInstance> => {
			if (resolveSelectorType(slctr) === 'type') {
				const connections = _.flatMap(Object.values(models.platformModel.connections[controllerId]))
				return getInstancesForType(slctr, connections)
			}
			const roleOrId = slctr.slice(1)
			return getInstancesForRole(roleOrId, findOnlyNestedComponents)
		}

		const selectors = selector.split(',').map((s) => s.trim())
		const instances = _.chain(selectors)
			.map(getComponentInstances)
			.flatMap()
			.uniqBy('uniqueId') // all SdkInstance have id
			.value()
		if (selectors.length === 1 && resolveSelectorType(selector) === 'nickname') {
			return _.first(instances) || []
		}
		return instancesObjectFactory(instances)
	}

	const $wFactory: WixSelector['$wFactory'] = (controllerId: string, getInstancesForRole, repeaterId): $W => {
		const wixSelectorInternal = (selector: string, { findOnlyNestedComponents } = { findOnlyNestedComponents: false }) => {
			if (selector === 'Document') {
				return $wDocument(controllerId)
			}
			return $wComponent(selector, controllerId, { getInstancesForRole, findOnlyNestedComponents })
		}

		const $w = (selector: string) => wixSelectorInternal(selector)

		const controllerEvents = controllerEventsFactory.createScopedControllerEvents(controllerId)
		const currentScope = repeaterId ? getRepeaterScopeContext(repeaterId) : { type: EVENT_CONTEXT_SCOPE.GLOBAL_SCOPE }

		$w.fireEvent = controllerEvents.fireEvent
		$w.off = controllerEvents.off
		$w.on = controllerEvents.on
		$w.once = controllerEvents.once
		$w.onReady = (cb: () => Promise<any>) => queueOnReadyCallback(cb, controllerId)
		$w.at = (context: EventContext) => {
			if (_.isEqual(_.omit(context, ['itemId']), currentScope)) {
				return $w
			}

			if (context.type === EVENT_CONTEXT_SCOPE.COMPONENT_SCOPE) {
				// repeated-item-scope selector
				const componentContext = context as ComponentEventContext
				const compId = componentContext._internal.repeaterCompId
				return $wFactory(controllerId, getScopedInstancesForRole(models, controllerId, compId, componentContext.itemId!, getInstance), compId)
			}

			return create$w(controllerId)
		}
		$w.createEvent = _.noop // currently not implementing in thunderbolt since its not used
		$w.onRender = (cb: () => Promise<any>) => queueOnReadyCallback(cb, controllerId) // deprecated
		$w.scoped = (selector: string) =>
			wixSelectorInternal(selector, {
				findOnlyNestedComponents: true
			})

		return $w as $W
	}

	const create$w: WixSelector['create$w'] = (controllerCompId) => $wFactory(controllerCompId, createInstancesGetter(controllerCompId))

	return {
		create$w,
		getInstance,
		$wFactory,
		flushOnReadyCallbacks
	}
}

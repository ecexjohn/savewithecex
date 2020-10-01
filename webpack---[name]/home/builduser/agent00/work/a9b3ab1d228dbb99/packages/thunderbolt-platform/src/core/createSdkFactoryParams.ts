import { PlatformUtils, SdkInstance, PlatformLogger, Connection, $W } from '@wix/thunderbolt-symbols'
import { componentSdkFactoryArgs } from '@wix/thunderbolt-platform-types'
import { Model } from './types'
import { ViewerAPI } from '../types'
import { IPlatformAnimationsAPI, RunAnimationOptions } from '../animations-types'
import { CreateSetProps } from './setPropsFactory'
import { MasterPageId } from './constants'
import { InstanceCacheFactory } from './instanceCache'
import { WixSelector } from './wixSelector'
import { RegisterEventFactory } from './createRegisterEvent'

export type SdkFactoryParams = {
	getSdkFactoryParams(args: {
		compId: string
		controllerCompId: string
		getChildren: () => Array<SdkInstance>
		connection?: Connection
		compType: string
		role: string
		getInstance: WixSelector['getInstance']
		create$w: () => $W
	}): componentSdkFactoryArgs
}

export default function({
	models,
	viewerAPI,
	getCompRefById,
	platformUtils,
	createSdkHandlers,
	createSetProps,
	sdkInstancesCache,
	registerEventFactory,
	animationsApi
}: {
	models: Model
	viewerAPI: ViewerAPI
	getCompRefById: (compId: string) => any
	platformUtils: PlatformUtils
	createSdkHandlers: (pageId: string) => any
	logger: PlatformLogger
	createSetProps: CreateSetProps
	sdkInstancesCache: InstanceCacheFactory
	registerEventFactory: RegisterEventFactory
	animationsApi: IPlatformAnimationsAPI
}) {
	function getSdkFactoryParams({
		compId,
		getChildren,
		connection,
		compType,
		controllerCompId,
		role,
		getInstance,
		create$w
	}: {
		compId: string
		controllerCompId: string
		getChildren: () => Array<SdkInstance>
		connection: Connection
		compType: string
		role: string
		getInstance: WixSelector['getInstance']
		create$w: () => $W
	}) {
		const props = models.propsModel[compId]
		const sdkData = models.platformModel.sdkData[compId]
		const handlers = createSdkHandlers(models.getPageIdByCompId(compId))
		const { hiddenOnLoad, collapseOnLoad } = models.platformModel.onLoadProperties[compId] || {}
		const onLoadProperties = {
			hidden: Boolean(hiddenOnLoad),
			collapsed: Boolean(collapseOnLoad)
		}

		function getSdkInstance() {
			return sdkInstancesCache.getSdkInstance({ compId, controllerCompId, role })
		}

		const isGlobal = () => models.getPageIdByCompId(compId) === MasterPageId

		function getParent(childId: string = compId): SdkInstance | null {
			const parentId = models.getParentId(childId)
			if (!parentId) {
				return null
			}
			const parentCompType = models.getCompType(parentId) as string
			const parentRole = models.getRoleForCompId(parentId, controllerCompId)
			if (!parentRole) {
				// becky structure hierarchy might be different than the document structure.
				return getParent(parentId)
			}
			return getInstance({ controllerCompId, compId: parentId, compType: parentCompType, role: parentRole })
		}

		const getOwnSdkInstance = () => getInstance({ controllerCompId, compId, compType, connection, role })
		const registerEvent = registerEventFactory.createRegisterEvent(compId, getOwnSdkInstance)
		const createEvent = registerEventFactory.getCreateEventFunction(getOwnSdkInstance)

		return {
			props,
			sdkData,
			compId,
			controllerCompId,
			setStyles: (style: object) => viewerAPI.updateStyles({ [compId]: style }),
			setProps: createSetProps(compId),
			compRef: getCompRefById(compId),
			handlers,
			getChildren,
			onLoadProperties,
			registerEvent,
			createEvent,
			getSdkInstance,
			role,
			runAnimation: (options: Omit<RunAnimationOptions, 'compId'>) => animationsApi.runAnimation({ ...options, compId }),
			create$w,
			metaData: {
				compId,
				role,
				connection,
				compType,
				isGlobal,
				hiddenOnLoad: Boolean(hiddenOnLoad),
				collapsedOnLoad: Boolean(collapseOnLoad),
				isRendered: () => models.isRendered(compId),
				getParent,
				getChildren
			},
			...platformUtils
		}
	}
	return {
		getSdkFactoryParams
	}
}

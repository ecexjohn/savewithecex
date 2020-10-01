import { getDisplayedId } from '@wix/thunderbolt-commons'
import { WixSelector } from './wixSelector'
import { Model } from './types'
import { EVENT_CONTEXT_SCOPE } from './constants'

function resolveRepeaterCompId(compId: string, itemId: string, repeaterId: string, findOnlyNestedComponents: boolean, platformModel: Model['platformModel']) {
	if (platformModel.sdkData[repeaterId].repeaterChildComponents.includes(compId)) {
		return getDisplayedId(compId, itemId)
	}
	if (findOnlyNestedComponents) {
		return null // compId is not a child of the repeater
	}
	return compId
}

export function getScopedInstancesForRole(models: Model, controllerCompId: string, repeaterId: string, itemId: string, getInstanceFn: WixSelector['getInstance']) {
	const { structureModel, propsModel, platformModel } = models

	return (role: string, findOnlyNestedComponents: boolean) => {
		return platformModel.connections[controllerCompId][role]
			? platformModel.connections[controllerCompId][role]
					.map((connection) => {
						const compId = connection.compId
						const itemCompId = resolveRepeaterCompId(compId, itemId, repeaterId, findOnlyNestedComponents, platformModel)
						if (!itemCompId) {
							return null
						}
						if (!propsModel[itemCompId]) {
							propsModel[itemCompId] = { ...propsModel[compId] }
						}
						const compType = structureModel[compId].componentType
						return getInstanceFn({
							compId: itemCompId,
							connection,
							role,
							compType,
							controllerCompId
						})
					})
					.filter((v) => v)
			: []
	}
}

export function getRepeaterScopeContext(repeaterCompId: string, itemId?: string) {
	return {
		type: EVENT_CONTEXT_SCOPE.COMPONENT_SCOPE,
		...(itemId && { itemId }),
		get _internal() {
			return { repeaterCompId }
		}
	}
}

import { withDependencies } from '@wix/thunderbolt-ioc'
import { ITpaContextMapping } from './types'

export const TpaContextMappingFactory = withDependencies(
	[],
	(): ITpaContextMapping => {
		const componentsContext: { [compId: string]: string } = {}
		const componentsTemplateIdToCompId: { [compId: string]: string } = {}
		return {
			/* runtime components that will persist on page navigation will
				fail to find the context id and then fail to invoke any handler.
				for this reason we map compId to its context id to avoid being
				dependent on the structure store after navigation
			 */
			registerTpasForContext(contextId, componentIds) {
				componentIds.forEach((compId) => {
					componentsContext[compId] = contextId
				})
			},
			getTpaComponentContextId(compId) {
				return componentsContext[compId]
			},
			registerTpaTemplateId(templateId, componentId) {
				componentsTemplateIdToCompId[templateId] = componentId
			},
			getTpaComponentIdFromTemplate(templateId) {
				return componentsTemplateIdToCompId[templateId]
			},
		}
	}
)

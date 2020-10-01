import _ from 'lodash'
import { RawModel, RenderedAPI } from './types'

export default function({ model, getCompType, getParentId }: { model: RawModel; getCompType: any; getParentId: any }): RenderedAPI {
	const isRenderedInSlideShow = (slideId: string, slideShowId: string) => {
		const { components } = model.structureModel[slideShowId]
		return model.propsModel[slideShowId].currentSlideIndex === _.indexOf(components, slideId)
	}

	const isRenderedInStateBox = (/* stateBoxStateId: string, stateBoxId: string*/) => {
		// TO-DO
		return true
	}

	const getAncestorsOfType = (
		compId: string | undefined,
		types: Array<string>
	): { ancestorCompType: 'SlideShowSlide' | 'StateBox' | undefined; ancestorCompId: string | undefined; parentId: string | undefined } => {
		while (compId) {
			const ancestorCompType = getCompType(compId)
			if (_.includes(types, ancestorCompType)) {
				const ancestorCompId = getParentId(compId)
				return { ancestorCompType, ancestorCompId, parentId: compId }
			}
			compId = getParentId(compId)
		}
		return {
			ancestorCompType: undefined,
			ancestorCompId: undefined,
			parentId: undefined
		}
	}

	return {
		isRendered(compId: string | undefined): boolean {
			const logicForRenderedComps = { SlideShowSlide: isRenderedInSlideShow, StateBox: isRenderedInStateBox }
			const relevantCompsForRendered = ['SlideShowSlide', 'StateBoxState']
			const { ancestorCompType, ancestorCompId, parentId } = getAncestorsOfType(compId, relevantCompsForRendered)
			if (ancestorCompType && ancestorCompId && parentId) {
				return logicForRenderedComps[ancestorCompType](parentId, ancestorCompId)
			}
			return true
		}
	}
}

import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import { Animator, AnimationsPageState, AnimatorManager, IAnimations } from './types'
import { name } from './symbols'
import { IFeatureState } from 'thunderbolt-feature-state'

const getElements = (ids: Array<string>): Array<Element> => {
	const elements = ids.map((id) => document.getElementById(id))
	return elements.filter((element) => element) as Array<Element>
}

const getElementsFromObj = (obj: Record<string, string>): Record<string, Element> =>
	Object.entries(obj).reduce((elements: Record<string, Element>, [key, id]) => {
		const element = document.getElementById(id)
		return element ? Object.assign(elements, { [key]: element }) : elements
	}, {})

export const getAnimatorManager = (animator: Animator): AnimatorManager => ({
	getAnimationProperties(animationName: string) {
		return animator.getProperties(animationName)
	},
	kill(instance, seek = 0) {
		animator.kill(instance, seek)
	},
	reverse(instance) {
		instance.reversed(!instance.reversed())
	},
	runAnimation({ name: animationName, targetId, duration = 0, delay = 0, animationSelectors = {}, params = {} }) {
		const targetIds = Array.isArray(targetId) ? targetId : [targetId]
		const elements = getElements(targetIds)
		const elementsForParams = getElementsFromObj(animationSelectors)
		return animator.animate(animationName, elements, duration, delay, { ...params, ...elementsForParams })
	},
	runTransition({ name: transitionName, srcId, targetId, duration = 0, delay = 0, params = {} }) {
		const srcIds = Array.isArray(srcId) ? srcId : [srcId]
		const targetIds = Array.isArray(targetId) ? targetId : [targetId]
		const srcElements = getElements(srcIds)
		const targetElements = getElements(targetIds)

		return animator.transition(transitionName, srcElements, targetElements, duration, delay, params)
	},
	runSequence(sequenceItems, callbacks = {}) {
		const sequence = animator.sequence({ callbacks })

		sequenceItems.forEach((sequenceItem) =>
			sequenceItem.type === 'Animation'
				? sequence.add(this.runAnimation(sequenceItem.data))
				: sequence.add(this.runTransition(sequenceItem.data))
		)

		return sequence
	},
	runAnimationOnElements: animator.animate,
	createSequence: animator.sequence,
	createAnimationFromParams: animator.animate, // TODO: probably should replace runAnimationOnElements
})

const animationsFactory = (featureState: IFeatureState<AnimationsPageState>): IAnimations => {
	return {
		// Do NOT await for this promise to resolve before AppDidMount phase!
		async getInstance() {
			return await featureState.get().animatorManager
		},
	}
}

export const AnimationsFactory = withDependencies([named(FeatureStateSymbol, name)], animationsFactory)
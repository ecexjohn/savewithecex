import { withDependencies } from '@wix/thunderbolt-ioc'
import { SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { AnimationCallbacks, AnimationData, IAnimations, WixCodeAnimationsHandlers } from '../types'
import { Animations } from '../symbols'

export const wixCodeHandlersProvider = withDependencies(
	[Animations],
	(animations: IAnimations): SdkHandlersProvider<WixCodeAnimationsHandlers> => {
		return {
			getSdkHandlers() {
				return {
					async runAnimation(animationData: AnimationData): Promise<void> {
						let resolvePromise: () => void
						const animationCompletePromise = new Promise<void>((resolve) => {
							resolvePromise = resolve
						})
						const callbacks: AnimationCallbacks = {
							onComplete: () => resolvePromise(),
							// TODO maybe onInterrupt and onReverseComplete not needed for platform handler?
							onInterrupt: () => resolvePromise(),
							onReverseComplete: () => resolvePromise(),
						}
						const animatorManager = await animations.getInstance()
						animatorManager.runAnimation({
							...animationData,
							params: { ...animationData.params, callbacks },
						})
						return animationCompletePromise
					},
				}
			},
		}
	}
)

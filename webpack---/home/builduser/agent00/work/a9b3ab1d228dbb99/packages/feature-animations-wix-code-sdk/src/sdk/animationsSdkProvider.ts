import { optional, withDependencies } from '@wix/thunderbolt-ioc'
import { DomReadySymbol, IPageDidUnmountHandler, SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { AnimationsWixCodeSdkHandlers, TimelineEvent, TimelineEventHandler } from '../types'
import { Animations, AnimatorManager, IAnimations, Sequence } from 'feature-animations'

const TIMELINE_ANIMATION = 'TimelineAnimation'

const getElements = (compIds: Array<string>): Array<Element> => {
	const elements = compIds.map((id) => document.getElementById(id))
	return elements.filter((element) => element) as Array<Element>
}

export const animationsWixCodeSdkParamsProvider = withDependencies(
	[optional(Animations), optional(DomReadySymbol)],
	(
		animationsManager: IAnimations,
		domReadyPromise: Promise<void>
	): SdkHandlersProvider<AnimationsWixCodeSdkHandlers> & IPageDidUnmountHandler => {
		const timelines: Record<string, Sequence> = {}
		const timelineEvents: Record<string, Partial<Record<TimelineEvent, TimelineEventHandler>>> = {}
		const animatorManager: AnimatorManager | null = null
		const getAnimator = async () => animatorManager || (await animationsManager.getInstance())
		const waitForDOMAndAnimationManager = () => Promise.all([getAnimator(), domReadyPromise])
		return {
			getSdkHandlers: () => ({
				createTimeline: async (timelineId, TimelineParams) => {
					const [animator] = await waitForDOMAndAnimationManager()
					timelines[timelineId] = animator.createSequence({
						...TimelineParams,
						data: { id: timelineId },
					})
				},
				addToTimeline: async (timelineId, compIds, params, offset) => {
					const [animator] = await waitForDOMAndAnimationManager()
					const timeline = timelines[timelineId]
					if (timeline) {
						const elements = getElements(compIds)
						const animateSingle = ({ duration = 0, delay = 0, ...animationParams }) =>
							animator.createAnimationFromParams(
								TIMELINE_ANIMATION,
								elements,
								duration,
								delay,
								animationParams
							)
						timeline.add(params.map(animateSingle), offset)
					}
				},
				playTimeline: async (timelineId) => {
					await waitForDOMAndAnimationManager()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.play()
					}
				},
				pauseTimeline: async (timelineId) => {
					await waitForDOMAndAnimationManager()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.pause()
					}
				},
				seekTimeline: async (timelineId, position) => {
					await waitForDOMAndAnimationManager()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.seek(position)
					}
				},
				reverseTimeline: async (timelineId) => {
					await waitForDOMAndAnimationManager()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.reverse()
					}
				},
				onStartTimeline: async (timelineId) => {
					await waitForDOMAndAnimationManager()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.event('onStart', () => {
							timelineEvents[timelineId].onStart!()
						})
					}
				},
				onCompleteTimeline: async (timelineId) => {
					await waitForDOMAndAnimationManager()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.event('onComplete', () => {
							timelineEvents[timelineId].onComplete!()
						})
					}
				},
				onRepeatTimeline: async (timelineId) => {
					await waitForDOMAndAnimationManager()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.event('onRepeat', () => {
							timelineEvents[timelineId].onRepeat!()
						})
					}
				},
				onReverseCompleteTimeline: async (timelineId) => {
					await waitForDOMAndAnimationManager()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.event('onReverseComplete', () => {
							timelineEvents[timelineId].onReverseComplete!()
						})
					}
				},
				registerTimelineEvent: (cb, timelineId: string, timelineEvent: TimelineEvent) => {
					if (!timelineEvents[timelineId]) {
						timelineEvents[timelineId] = {}
					}
					timelineEvents[timelineId][timelineEvent] = cb
				},
			}),
			pageDidUnmount: () => {
				Object.entries(timelines).forEach(async (timeline, timelineId) => {
					const animator = await getAnimator()
					animator.kill(timeline, 0)
					delete timelines[timelineId]
				})
			},
		}
	}
)

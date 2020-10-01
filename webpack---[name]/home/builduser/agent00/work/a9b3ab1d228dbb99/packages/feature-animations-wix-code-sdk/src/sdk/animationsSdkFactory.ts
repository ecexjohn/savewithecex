import _ from 'lodash'

import {
	AnimationAttributes,
	AnimationParams,
	AnimationsWixCodeSdkFactoryInitialState,
	AnimationsWixCodeSdkHandlers,
	AnimationsWixCodeSdkWixCodeApi,
	namespace,
	OffsetParams,
	Timeline,
	TimelineEventHandler,
	TimelineEvent,
	TimelineOptions,
	TimelineParams,
} from '..'
import {
	buildAnimationParams,
	filterInvalidAnimationParams,
	validateTimelineParams,
} from './validations/animationValidations'
import { reportNonAnimatableComponents } from './reporter/warnReport'
import { SdkInstance } from '@wix/thunderbolt-symbols'
import { logSdkWarning } from '@wix/thunderbolt-commons'

const TIMELINES_EVENTS: Array<TimelineEvent> = ['onComplete', 'onRepeat', 'onReverseComplete', 'onStart']

const buildOffsetParam = (offset: string | number | undefined = '+=0', timelineId: string) => {
	const validAnimation = filterInvalidAnimationParams('timelineAnimation', { offset }, timelineId) as {
		offset: number | string
	}
	const { offset: parsedOffset } = buildAnimationParams('timelineAnimation', validAnimation) as OffsetParams
	return parsedOffset
}

const getCompIds = (target: SdkInstance) => {
	const comps = Array.isArray(target) ? target : [target]
	const animatables: Array<SdkInstance> = []
	const nonAnimatables: Array<SdkInstance> = []
	comps.forEach((comp) => (comp && comp.isAnimatable ? animatables.push(comp) : nonAnimatables.push(comp)))
	if (nonAnimatables.length) {
		reportNonAnimatableComponents(nonAnimatables)
	}
	// return the compId
	return animatables.map((comp) => comp.uniqueId)
}
const buildAnimationsParams = (animations: AnimationAttributes | Array<AnimationAttributes>, timelineId: string) => {
	const animationsParams = Array.isArray(animations) ? animations : [animations]
	return animationsParams.reduce((arr, animation) => {
		const validAnimation = filterInvalidAnimationParams(
			'timelineAnimation',
			animation,
			timelineId
		) as AnimationAttributes
		if (Object.keys(validAnimation).length) {
			arr.push(buildAnimationParams('timelineAnimation', validAnimation) as AnimationParams)
		}
		return arr
	}, [] as Array<AnimationParams>)
}

const buildTimelineParams = (timelineOptions: TimelineOptions, timelineId: string): TimelineParams => {
	return {
		...validateTimelineParams(timelineOptions, timelineId),
		paused: true,
	}
}

export function AnimationsSdkFactory(
	__: AnimationsWixCodeSdkFactoryInitialState,
	handlers: AnimationsWixCodeSdkHandlers
): { [namespace]: AnimationsWixCodeSdkWixCodeApi } {
	const {
		createTimeline,
		addToTimeline,
		playTimeline,
		pauseTimeline,
		seekTimeline,
		reverseTimeline,
		onStartTimeline,
		onCompleteTimeline,
		onRepeatTimeline,
		onReverseCompleteTimeline,
		registerTimelineEvent,
	} = handlers
	const timelineEvents: Record<string, Partial<Record<TimelineEvent, TimelineEventHandler>>> = {}
	const initTimelineEvents = (timelineId: string) => {
		timelineEvents[timelineId] = {}
		TIMELINES_EVENTS.forEach((timelineEvent) => {
			registerTimelineEvent(
				() => {
					if (timelineEvents[timelineId][timelineEvent]) {
						timelineEvents[timelineId][timelineEvent]!()
					}
				},
				timelineId,
				timelineEvent
			)
		})
	}
	return {
		[namespace]: {
			timeline: (timelineOptions: TimelineOptions = {}) => {
				const timelineId = _.uniqueId('timeline_')
				const state = {
					animatable: false,
				}
				initTimelineEvents(timelineId)
				createTimeline(timelineId, buildTimelineParams(timelineOptions, timelineId))
				const timeline: Timeline = {
					add: (comps, animations = [], offset) => {
						const compIds = getCompIds(comps)
						if (!compIds.length) {
							logSdkWarning('The Component parameter is required for animate method.')
							return timeline
						}
						const params = buildAnimationsParams(animations, timelineId)
						if (!params.length) {
							return timeline
						}
						// validate offset value, report bad and return a valid value (or valid default)
						const validOffset = buildOffsetParam(offset, timelineId)
						addToTimeline(timelineId, compIds, params, validOffset)
						state.animatable = true
						return timeline
					},
					play: () => {
						// If state.animatable is false than no 'add()' commands were called
						if (!state.animatable) {
							logSdkWarning('Timeline.play: Nothing to play')
						} else {
							playTimeline(timelineId)
						}
						return timeline
					},
					pause: () => {
						// If state.animatable is false than no 'add()' commands were called
						if (!state.animatable) {
							logSdkWarning('Timeline.pause: Nothing to pause')
						} else {
							pauseTimeline(timelineId)
						}
						return timeline
					},
					replay: () => {
						// If state.animatable is false than no 'add()' commands were called
						if (!state.animatable) {
							logSdkWarning('Timeline.reverse: Nothing to play')
						} else {
							seekTimeline(timelineId, 0)
							playTimeline(timelineId)
						}
						return timeline
					},
					reverse: () => {
						// If state.animatable is false than no 'add()' commands were called
						if (!state.animatable) {
							logSdkWarning('Timeline.reverse: Nothing to play')
						} else {
							reverseTimeline(timelineId)
						}
						return timeline
					},
					onStart: (handler) => {
						if (handler) {
							timelineEvents[timelineId].onStart = handler
							onStartTimeline(timelineId)
						}
						return timeline
					},
					onComplete: (handler) => {
						if (handler) {
							timelineEvents[timelineId].onComplete = handler
							onCompleteTimeline(timelineId)
						}
						return timeline
					},
					onRepeat: (handler) => {
						if (handler) {
							timelineEvents[timelineId].onRepeat = handler
							onRepeatTimeline(timelineId)
						}
						return timeline
					},
					onReverseComplete: (handler) => {
						if (handler) {
							timelineEvents[timelineId].onReverseComplete = handler
							onReverseCompleteTimeline(timelineId)
						}
						return timeline
					},
				}
				return timeline
			},
		},
	}
}

import { AnimationData, WixCodeAnimationsHandlers } from 'feature-animations'
import { IPlatformAnimationsAPI, EffectOptionsTypes, BaseEffectOptions } from './animations-types'
import _ from 'lodash'

// NOTE: animation data expects values in seconds while user code api provides milliseconds!

const sharedDefaults: BaseEffectOptions = { duration: 1200, delay: 0 }

const defaultEffectOptions: Partial<EffectOptionsTypes> = {
	arc: {
		direction: 'left'
	},
	bounce: {
		direction: 'topLeft',
		intensity: 'medium'
	},
	flip: {
		direction: 'right'
	},
	float: {
		direction: 'right'
	},
	fly: {
		direction: 'right'
	},
	fold: {
		direction: 'left'
	},
	glide: {
		angle: 0,
		distance: 0
	},
	roll: {
		direction: 'left'
	},
	slide: {
		direction: 'left'
	},
	spin: {
		direction: 'cw',
		cycles: 5
	},
	turn: {
		direction: 'right'
	}
}

const aliasToEffectName: { [alias: string]: string } = {
	PuffIn: 'DropIn',
	PuffOut: 'PopOut',
	RollIn: 'Reveal',
	RollOut: 'Conceal',
	ZoomIn: 'ExpandIn',
	ZoomOut: 'CollapseOut'
}

const millisToSeconds = (num: number) => num / 1000

type EffectSpecificAnimationDataParamsModifiers = {
	[EffectName in keyof EffectOptionsTypes]: (effectOptions: EffectOptionsTypes[EffectName]) => Partial<AnimationData['params']>
}

type AnimationDataParamsFactory = <EffectName extends keyof EffectOptionsTypes, EffectOptions = EffectOptionsTypes[EffectName] & BaseEffectOptions>(
	effectName: EffectName,
	effectOptions: EffectOptions
) => Partial<AnimationData['params']>

const splitCamelCaseIntoWords = (txt: string) => txt.split(/(?=[A-Z])/)

export const PlatformAnimationsAPI = (runAnimation: WixCodeAnimationsHandlers['runAnimation']): IPlatformAnimationsAPI => {
	const animationDataParamsFactory: AnimationDataParamsFactory = (effectName, effectOptions) => {
		const animationDataParams: Partial<AnimationData['params']> = {}

		const effectSpecificDataParamsBuilders: Partial<EffectSpecificAnimationDataParamsModifiers> = {
			arc: ({ direction }) => ({ direction }),
			bounce: ({ direction, intensity }) => ({
				bounce: intensity,
				// topLeft -> top left
				direction: splitCamelCaseIntoWords(direction)
					.join(' ')
					.toLowerCase()
			}),
			flip: ({ direction }) => ({ direction }),
			float: ({ direction }) => ({ direction }),
			fly: ({ direction }) => ({ direction }),
			fold: ({ direction }) => ({ direction }),
			glide: ({ angle, distance }) => ({ angle, distance }),
			roll: ({ direction }) => ({ direction }),
			slide: ({ direction }) => ({ direction }),
			spin: ({ direction, cycles }) => ({ direction, cycles }),
			turn: ({ direction }) => ({ direction })
		}

		if (effectName in effectSpecificDataParamsBuilders) {
			Object.assign(animationDataParams, effectSpecificDataParamsBuilders[effectName]!(effectOptions as any))
		}
		return animationDataParams
	}

	return {
		async runAnimation({ compId, animationDirection, effectName, effectOptions }) {
			if (!process.env.browser) {
				return
			}
			// move from partial to exhaustive object type
			const fullEffectOptions = _.defaults({ ...effectOptions }, defaultEffectOptions[effectName], sharedDefaults)
			const duration = millisToSeconds(fullEffectOptions.duration)
			const delay = millisToSeconds(fullEffectOptions.delay)

			// @ts-ignore
			const params = animationDataParamsFactory(effectName, fullEffectOptions)
			const effectAlias = _.capitalize(effectName) + _.capitalize(animationDirection)
			const animationData = {
				duration,
				delay,
				targetId: compId,
				name: aliasToEffectName[effectAlias] || effectAlias,
				params
			}
			return runAnimation(animationData)
		}
	}
}

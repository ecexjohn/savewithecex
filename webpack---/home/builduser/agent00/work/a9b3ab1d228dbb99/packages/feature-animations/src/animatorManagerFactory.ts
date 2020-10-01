import { ViewMode } from '@wix/thunderbolt-symbols'
// eslint-disable-next-line no-restricted-syntax
import tweenEngine from 'santa-core-utils/dist/cjs/coreUtils/tweenEngine/tweenEngine3'
import { getAnimatorManager } from './animations'
import gsap from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import { create } from 'santa-animations'

export const createAnimatorManager = (viewMode: ViewMode) => {
	const tweenEngineAndFactory = tweenEngine.create(gsap, [ScrollToPlugin])
	const animator = create(tweenEngineAndFactory, undefined, viewMode)

	return getAnimatorManager(animator)
}

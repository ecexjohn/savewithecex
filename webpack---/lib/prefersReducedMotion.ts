import { BrowserWindow, Experiments } from '@wix/thunderbolt-symbols'

export const prefersReducedMotion = (browserWindow: BrowserWindow, experiments: Experiments) => {
	const isReducedMotionExperimentOpen = experiments['specs.thunderbolt.reducedMotion']
	return browserWindow && isReducedMotionExperimentOpen
		? browserWindow.matchMedia('(prefers-reduced-motion: reduce)').matches
		: false
}

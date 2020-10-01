import { FeatureStateSymbol, IPageWillMountHandler, ViewMode, ViewModeSym } from '@wix/thunderbolt-symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { name } from './symbols'
import { AnimationsPageState } from './types'
import { taskify } from '@wix/thunderbolt-commons'

const animationsInit = (
	featureState: IFeatureState<AnimationsPageState>,
	viewMode: ViewMode
): IPageWillMountHandler => {
	return {
		pageWillMount() {
			if (!featureState.get()) {
				const animatorManagerPromise = import(
					'./animatorManagerFactory' /* webpackChunkName: "animatorManagerFactory" */
				).then((x) => taskify(() => x.createAnimatorManager(viewMode)))
				featureState.update(() => ({ animatorManager: animatorManagerPromise }))
			}
		},
	}
}

export const AnimationsInit = withDependencies([named(FeatureStateSymbol, name), ViewModeSym], animationsInit)

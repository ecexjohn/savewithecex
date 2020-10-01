import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	IPropsStore,
	Props,
	ReducedMotionSymbol,
} from '@wix/thunderbolt-symbols'
import { ReducedMotionPageConfig } from './types'
import { name } from './symbols'

const ReducedMotionFactory = (
	pageFeatureConfig: ReducedMotionPageConfig,
	reducedMotion: boolean,
	propsStore: IPropsStore
): IPageWillMountHandler => {
	return {
		pageWillMount: async () => {
			const { componentsIds } = pageFeatureConfig

			const updatedProps = componentsIds.reduce(
				(updatedObject, compId) => ({
					...updatedObject,
					...{
						[compId]: { reducedMotion },
					},
				}),
				{}
			)
			propsStore.update(updatedProps)
		},
	}
}

export const ReducedMotion = withDependencies(
	[named(PageFeatureConfigSymbol, name), ReducedMotionSymbol, Props],
	ReducedMotionFactory
)

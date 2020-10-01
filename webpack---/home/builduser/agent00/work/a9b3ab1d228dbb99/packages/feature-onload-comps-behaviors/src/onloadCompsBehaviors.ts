import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	ComponentsStylesOverridesSymbol,
	IComponentsStylesOverrides,
} from '@wix/thunderbolt-symbols'
import { OnloadCompsBehaviorsPageConfig } from './types'
import { name } from './symbols'
import { makeCollapse, makeHidden } from '@wix/thunderbolt-commons'

const onloadCompsBehaviorsFactory = (
	pageFeatureConfig: OnloadCompsBehaviorsPageConfig,
	componentsStylesOverrides: IComponentsStylesOverrides
): IPageWillMountHandler => {
	return {
		async pageWillMount() {
			const { compsBehaviors } = pageFeatureConfig
			const styleOverrides = Object.entries(compsBehaviors).reduce(
				(result, [compId, { collapseOnLoad, hiddenOnLoad }]) => ({
					...result,
					...(collapseOnLoad ? { [compId]: makeCollapse() } : {}),
					...(hiddenOnLoad ? { [compId]: makeHidden() } : {}),
				}),
				{}
			)
			componentsStylesOverrides.update(styleOverrides)
		},
	}
}

export const OnloadCompsBehaviors = withDependencies(
	[named(PageFeatureConfigSymbol, name), ComponentsStylesOverridesSymbol],
	onloadCompsBehaviorsFactory
)

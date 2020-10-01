import { IPropsStore, Props, IComponentsStylesOverrides, OverrideStylesObject } from '@wix/thunderbolt-symbols'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { STYLE_OVERRIDES_ID } from './symbols'

const ComponentsStylesOverridesFactory = (propsStore: IPropsStore): IComponentsStylesOverrides => {
	const getExistingStyles = (compId?: string) => {
		const { styles: existingStyles } = propsStore.get(STYLE_OVERRIDES_ID) || {
			styles: {},
		}
		return compId ? existingStyles[compId] : existingStyles
	}
	const getUpdatedStyle = (overrideStyles: OverrideStylesObject) => ({
		STYLE_OVERRIDES_ID: {
			styles: {
				...getExistingStyles(),
				...overrideStyles,
			},
		},
	})
	const isHidden = (compId: string) => {
		const compStyle = getExistingStyles(compId)
		return Boolean(compStyle?.visibility?.includes('hidden'))
	}
	return {
		getCompStyle: (compId: string) => getExistingStyles(compId),
		isHidden,
		getAllStyles: () => getExistingStyles(),
		getUpdatedStyle,
		update: (overrideStyles: OverrideStylesObject) => {
			propsStore.update(getUpdatedStyle(overrideStyles))
		},
		set: (allStyles: OverrideStylesObject) => {
			propsStore.update({
				STYLE_OVERRIDES_ID: {
					styles: allStyles,
				},
			})
		},
	}
}

export const ComponentsStylesOverrides = withDependencies([Props], ComponentsStylesOverridesFactory)

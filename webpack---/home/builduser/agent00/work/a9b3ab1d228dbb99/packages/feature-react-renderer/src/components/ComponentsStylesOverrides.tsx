import React, { ComponentType, useContext, useState, useCallback } from 'react'
import Context from './AppContext'
import { STYLE_OVERRIDES_ID } from '../symbols'

export type SdkStylesProps = {}

const createCssProperty = (style: object) =>
	Object.entries(style).reduce((styleString, [propName, propValue]) => `${styleString}${propName}:${propValue};`, '')

const createCssRule = ([compId, style]: [string, any]) => `[id^="${compId}"]{${createCssProperty(style)}}`

const ComponentsStylesOverrides: ComponentType<SdkStylesProps> = () => {
	const { props: propsStore } = useContext(Context)
	const [, setTick] = useState(0)
	const forceUpdate = useCallback(() => setTick((tick) => tick + 1), [])
	propsStore.subscribeById(STYLE_OVERRIDES_ID, forceUpdate)
	const { styles } = propsStore.get(STYLE_OVERRIDES_ID) || { styles: {} }
	const css = Object.entries(styles)
		.map(createCssRule)
		.join(' ')
	// TODO - sanitize css, e.g. background-image: url(javascript:alert('Injected'));
	return <style id={STYLE_OVERRIDES_ID} dangerouslySetInnerHTML={{ __html: css }} />
}

export default ComponentsStylesOverrides

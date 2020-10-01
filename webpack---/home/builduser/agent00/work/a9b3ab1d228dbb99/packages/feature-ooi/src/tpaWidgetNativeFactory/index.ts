import { ComponentType, FunctionComponent } from 'react'
import { Props } from './tpaWidgetNative'

const getFactory = (): ((ReactComponent?: ComponentType<any>) => FunctionComponent<Props>) => {
	if (process.env.browser) {
		return require('./tpaWidgetNativeClient').createTpaWidgetNative
	} else {
		return require('./tpaWidgetNativeSSR').createTpaWidgetNative
	}
}

export const createTpaWidgetNative = getFactory()

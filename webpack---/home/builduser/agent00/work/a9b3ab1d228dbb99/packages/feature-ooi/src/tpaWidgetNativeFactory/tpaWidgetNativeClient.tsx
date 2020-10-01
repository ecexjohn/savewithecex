import React, { ComponentType, FunctionComponent } from 'react'
import { reportError } from '@wix/thunderbolt-commons'
import { DeadComp, getStyle, Props } from './tpaWidgetNative'
import LazySentry from '../lazySentry'

type State = {
	hasError: boolean
}

class TpaWidgetNativeErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)

		this.state = { hasError: false }
	}

	componentDidCatch(error: Error) {
		reportError(error, LazySentry, this.props.sentryDsn)
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	render() {
		const ReactComponent = this.props.ReactComponent
		if (this.state.hasError || !ReactComponent) {
			return <DeadComp />
		}

		return <ReactComponent {...this.props} />
	}
}

export const createTpaWidgetNative: (ReactComponent?: ComponentType<any>) => FunctionComponent<Props> = (
	ReactComponent
) => {
	return (props) => (
		<div id={props.id} style={getStyle(props)}>
			<TpaWidgetNativeErrorBoundary {...props} ReactComponent={ReactComponent} />
		</div>
	)
}

import React, { ComponentType } from 'react'

export type Props = {
	id: string
	ReactComponent?: ComponentType<any>
	host: any
	sentryDsn?: string
}

export const getStyle = ({ host }: Props) => (host && host.isResponsive ? {} : { height: 'auto' })

export const DeadComp = () => React.createElement('div')

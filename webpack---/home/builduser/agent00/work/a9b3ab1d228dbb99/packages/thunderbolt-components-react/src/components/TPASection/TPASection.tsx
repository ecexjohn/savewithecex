import React, { ComponentType } from 'react'
import TPABaseComponent from '../TpaCommon/TPABaseComponent'
import { TPASectionProps, TPASectionBeckyProps } from '@wix/thunderbolt-components'

const TPASection: ComponentType<TPASectionProps & TPASectionBeckyProps> = (props) => {
	return <TPABaseComponent {...props} />
}

export default TPASection

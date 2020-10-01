import React, { ComponentType } from 'react'
import { TPAWidgetProps, TPAWidgetBeckyProps, DefaultCompPlatformProps } from '@wix/thunderbolt-components'

import TPABaseComponent from '../TpaCommon/TPABaseComponent'

const TPAWidget: ComponentType<DefaultCompPlatformProps & TPAWidgetProps & TPAWidgetBeckyProps> = (props) => {
	return <TPABaseComponent {...props} />
}

export default TPAWidget

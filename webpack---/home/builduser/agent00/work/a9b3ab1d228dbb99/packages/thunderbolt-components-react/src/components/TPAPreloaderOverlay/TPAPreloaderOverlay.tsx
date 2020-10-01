import React, { ComponentType } from 'react'
import style from './style/TPAPreloaderOverlay.scss'

const TPAPreloaderOverlay: ComponentType = () => {
	return (
		<div className={style.content}>
			<div className={style.circlePreloader} />
		</div>
	)
}

export default TPAPreloaderOverlay

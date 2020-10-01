import React, { ComponentType } from 'react'
import style from './style/TPAUnavailableMessageOverlay.scss'

type TPAUnavailableMessageOverlayProps = {
	text?: string
	reloadText?: string
	reload: Function
}

const TPAUnavailableMessageOverlay: ComponentType<TPAUnavailableMessageOverlayProps> = ({
	text,
	reloadText,
	reload,
}) => {
	return (
		<div className={style.content}>
			<div className={style.textContainer}>
				<span>{text}</span>
				{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
				<a className={style.reloadButton} onClick={() => reload()}>
					{reloadText}
				</a>
			</div>
		</div>
	)
}

export default TPAUnavailableMessageOverlay

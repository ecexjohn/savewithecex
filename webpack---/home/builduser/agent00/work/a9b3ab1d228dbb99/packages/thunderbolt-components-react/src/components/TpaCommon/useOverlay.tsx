import TPAPreloaderOverlay from '../TPAPreloaderOverlay/TPAPreloaderOverlay'
import TPAUnavailableMessageOverlay from '../TPAUnavailableMessageOverlay/TPAUnavailableMessageOverlay'
import React, { useEffect, useRef, useState } from 'react'
import { TPA_STATUS } from '@wix/thunderbolt-components'
import _ from 'lodash'

const ALIVE_TIMEOUT = 20000
const OVERLAY_GRACE = 5000

const DENY_IFRAME_RENDERING_STATES = {
	mobile: 'unavailableInMobile',
	https: 'unavailableInHttps',
}

const OVERLAY_STATES = {
	notInClientSpecMap: 'notInClientSpecMap',
	unresponsive: 'unresponsive',
	preloader: 'preloader',
}

export type Props = {
	isMobileView: boolean
	isAppInClientSpecMap: boolean
	isViewerMode: boolean
	sentAppIsAlive: boolean
}

export function useOverlay({ isMobileView, isAppInClientSpecMap, isViewerMode, sentAppIsAlive }: Props) {
	const unresponsiveText = isMobileView ? "Can't see the content? " : 'To view this content, click '
	const reloadText = isMobileView ? 'Tap to reload.' : 'reload.'

	const isMounted = useRef(false)
	const [overlayState, setOverlayState] = useState<string | null>(null)
	const showOverlayTimeout = useRef(0)
	const appIsAliveTimeout = useRef(0)
	const [isVisible, setVisibility] = useState<boolean>(false)
	const [status, setStatus] = useState<TPA_STATUS>('loading')

	useEffect(() => {
		isMounted.current = true
		scheduleShowOverlayTimeout()
		if (isViewerMode) {
			setOverlayState(calculateOverlayState())
		}
		if (!_.includes(DENY_IFRAME_RENDERING_STATES, overlayState)) {
			scheduleAliveTimeout()
			// TODO tpaUtils.incAppCounter();
		}

		return () => {
			isMounted.current = false
			clearAliveTimeout()
			clearShowOverlayTimeout()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (sentAppIsAlive) {
			clearAliveTimeout()
			clearShowOverlayTimeout()
			setStatus('alive')
			if (overlayState === OVERLAY_STATES.preloader) {
				setOverlayState(null)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sentAppIsAlive])

	const getInitialOverlayState = () => {
		// TODO
		// if (isMobileView && !this.isMobileReady()) {
		// 	return DENY_IFRAME_RENDERING_STATES.mobile;
		// }

		if (!isAppInClientSpecMap) {
			return OVERLAY_STATES.notInClientSpecMap
		}

		return OVERLAY_STATES.preloader
	}

	const reload = () => {
		scheduleShowOverlayTimeout()
		scheduleAliveTimeout()
		setVisibility(false)
		setOverlayState(null)
	}

	const clearAliveTimeout = () => {
		if (appIsAliveTimeout) {
			clearTimeout(appIsAliveTimeout.current)
			appIsAliveTimeout.current = 0

			// TODO tpaUtils.decAppCounter(this.props.reportBeatEvent, this.props.primaryPageId);
		}
	}

	const clearShowOverlayTimeout = () => {
		if (showOverlayTimeout) {
			clearTimeout(showOverlayTimeout.current)
			showOverlayTimeout.current = 0
		}
	}

	const scheduleShowOverlayTimeout = () => {
		clearShowOverlayTimeout()
		showOverlayTimeout.current = window.setTimeout(() => {
			clearShowOverlayTimeout()
			showOverlayIfNeeded()
		}, OVERLAY_GRACE)
	}

	const showOverlayIfNeeded = () => {
		if (
			isMounted.current &&
			status !== 'alive' &&
			((!overlayState && isAppInClientSpecMap) || (!isAppInClientSpecMap && !isViewerMode))
		) {
			setOverlayState(getInitialOverlayState())
			setVisibility(true)
		}
		setStatus('loading')
	}

	const scheduleAliveTimeout = () => {
		clearAliveTimeout()
		appIsAliveTimeout.current = window.setTimeout(() => {
			clearAliveTimeout()
			if (isMounted.current && status !== 'alive' && isAppInClientSpecMap) {
				setOverlayState(OVERLAY_STATES.unresponsive)
				setVisibility(true)
			}
		}, ALIVE_TIMEOUT)
	}

	const calculateOverlayState = () => {
		if (status !== 'alive' && (!overlayState || overlayState !== OVERLAY_STATES.unresponsive)) {
			return overlayState
		}

		const underMobileAndNotSupported = false // TODO this.isUnderMobileView() && this.isMobileReady && !this.isMobileReady();
		if (underMobileAndNotSupported) {
			return DENY_IFRAME_RENDERING_STATES.mobile
		} else if (isAppInClientSpecMap) {
			return OVERLAY_STATES.preloader
		} else {
			return OVERLAY_STATES.notInClientSpecMap
		}
	}

	const createOverlayComponent = () => {
		switch (overlayState) {
			case OVERLAY_STATES.preloader:
				return <TPAPreloaderOverlay />
			case OVERLAY_STATES.unresponsive:
				return <TPAUnavailableMessageOverlay text={unresponsiveText} reloadText={reloadText} reload={reload} />
			case DENY_IFRAME_RENDERING_STATES.https:
				return (
					<TPAUnavailableMessageOverlay
						text={"We're sorry, this content cannot be displayed."}
						reload={reload}
					/>
				)
			case DENY_IFRAME_RENDERING_STATES.mobile:
				return (
					<TPAUnavailableMessageOverlay
						text={"We're sorry, this content is currently not optimized for mobile view."}
						reload={reload}
					/>
				)
			case OVERLAY_STATES.notInClientSpecMap:
				return <TPAUnavailableMessageOverlay reload={reload} />
			default:
				return null
		}
	}

	if (
		!isVisible &&
		(status === 'alive' ||
			overlayState === OVERLAY_STATES.preloader ||
			overlayState === OVERLAY_STATES.unresponsive ||
			overlayState === DENY_IFRAME_RENDERING_STATES.mobile)
	) {
		setVisibility(true)
	}

	return {
		isVisible,
		shouldShowIframe: !overlayState || overlayState === OVERLAY_STATES.preloader,
		overlay: createOverlayComponent(),
	}
}

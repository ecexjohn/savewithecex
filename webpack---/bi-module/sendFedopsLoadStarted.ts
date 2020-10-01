//	eslint-disable-next-line
(function() {
	function sendBeacon(url: string) {
		let sent = false
		try {
			sent = navigator.sendBeacon(url)
		} catch (e) {}
		if (!sent) {
			new Image().src = url
		}
	}
	let is_cached = false
	function isCached(part: any) {
		return !!part && part.indexOf('hit') === 0
	}
	const match = document.cookie.match(
		/ssr-caching="?cache[,#]\s*desc=(\w+)(?:[,#]\s*varnish=(\w+))?(?:[,#]\s*dc[,#]\s*desc=(\w+))?(?:"|;|$)/
	)

	if (match && match.length) {
		const caching = `${match[1]},${match[2] || 'none'}`
		is_cached = isCached(caching)
	}
	if (!match && window.PerformanceServerTiming) {
		const serverTiming = performance.getEntriesByType('navigation')[0].serverTiming
		if (serverTiming && serverTiming.length) {
			const names = ['cache', 'constnish', 'dc']
			const parts: Array<string> = []
			serverTiming.forEach(function(entry) {
				const i = names.indexOf(entry.name)
				if (i > 0) {
					parts[i] = entry.description
				}
			})
			is_cached = isCached(parts[1]) || isCached(parts[2])
		}
	}

	const { site, rollout, fleetConfig } = window.fedops.data
	const fedOpsAppName = site.isResponsive ? 'thunderbolt-responsive' : 'thunderbolt'
	const { isDACRollout, siteAssetsVersionsRollout } = rollout
	const is_dac_rollout = isDACRollout ? 1 : 0
	const is_sav_rollout = siteAssetsVersionsRollout ? 1 : 0
	const is_rollout = fleetConfig.code === 0 || fleetConfig.code === 1 ? fleetConfig.code : null
	const ts = Date.now() - window.initialTimestamps.initialTimestamp
	const tsn = Date.now() - window.initialTimestamps.initialRequestTimestamp
	window.fedops = window.fedops || {}
	window.fedops.apps = window.fedops.apps || {}
	window.fedops.apps[fedOpsAppName] = { startLoadTime: tsn }
	window.fedops.sessionId = site.sessionId
	window.fedops.is_cached = is_cached

	window.fedops.phaseMark = (phase: string) => {
		const duration = Date.now() - ts
		const phaseUrl =
			'//frog.wix.com/bolt-performance?src=72&evid=22&appName=' +
			fedOpsAppName +
			'&is_rollout=' +
			is_rollout +
			'&is_sav_rollout=' +
			is_sav_rollout +
			'&is_dac_rollout=' +
			is_dac_rollout +
			'&dc=' +
			window.viewerModel.site.dc +
			'&is_cached=' +
			is_cached +
			'&msid=' +
			window.viewerModel.site.metaSiteId +
			'&session_id=' +
			window.fedops.sessionId +
			'&name=' +
			phase +
			'&duration=' +
			duration
		sendBeacon(phaseUrl)
	}

	const url =
		'//frog.wix.com/bolt-performance?src=72&evid=21&appName=' +
		fedOpsAppName +
		'&is_rollout=' +
		is_rollout +
		'&is_sav_rollout=' +
		is_sav_rollout +
		'&is_dac_rollout=' +
		is_dac_rollout +
		'&dc=' +
		site.dc +
		'&is_cached=' +
		is_cached +
		'&msid=' +
		site.metaSiteId +
		'&session_id=' +
		window.fedops.sessionId +
		'&ts=' +
		ts +
		'&tsn=' +
		tsn
	sendBeacon(url)
})()

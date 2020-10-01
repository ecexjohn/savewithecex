export default () =>
	/bot|google|phantom|crawler|spider|crawling|headless|slurp|facebookexternal|Lighthouse|PTST|^mozilla\/4\.0$|^\s*$/i.test(
		window.navigator.userAgent
	)

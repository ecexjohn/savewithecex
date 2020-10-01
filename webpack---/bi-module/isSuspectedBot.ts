export default () => {
	if (!Function.prototype.bind) {
		return true
	}

	const { webdriver, languages } = window.navigator
	if (webdriver) {
		return true
	}
	if (languages && languages.length === 0) {
		return true
	}
	try {
		// @ts-ignore
		languages.push('hello')
		return true
	} catch (e) {
		// empty
	}

	let stack
	try {
		// @ts-ignore
		null[0]()
	} catch (e) {
		stack = e.stack
	}
	if (stack && /ph\x61n\x74om|n\x6fde[^_]/i.test(stack)) {
		return true
	}

	return false
}

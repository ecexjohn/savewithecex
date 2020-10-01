export default () => {
	try {
		return window.self === window.top
	} catch (e) {
		return false
	}
}

export function loadScriptTag(src: string) {
	return new Promise((resolve, reject) => {
		if (!document) {
			reject('document is not defined')
		}
		const script = document.createElement('script')
		script.src = src
		script.onerror = reject
		script.onload = resolve
		document.head.appendChild(script)
	})
}

export function loadScriptWithRequireJS(src: string) {
	return new Promise((resolve, reject) => __non_webpack_require__([src], resolve, reject))
}

export const scriptUrls = {
	PM_RPC: 'https://static.parastorage.com/unpkg/pm-rpc@2.0.0/build/pm-rpc.min.js',
}

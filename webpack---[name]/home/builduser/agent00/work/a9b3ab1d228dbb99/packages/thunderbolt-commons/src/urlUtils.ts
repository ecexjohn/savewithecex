export const getDecodedUrlObject = (url: string) =>
	new Proxy(new URL(url), {
		get(target, prop: keyof URL) {
			switch (prop) {
				case 'href':
				case 'pathname':
					return decodeURI(target[prop])
				case 'search':
					return decodeURIComponent(target[prop])
				default:
					return target[prop]
			}
		},
	})

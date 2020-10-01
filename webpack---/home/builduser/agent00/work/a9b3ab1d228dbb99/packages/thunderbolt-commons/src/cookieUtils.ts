export const parseCookieString = (cookieStr: string) => {
	if (!cookieStr) {
		return {}
	}
	const cookiesArr = cookieStr.split(/;\s*/)
	return cookiesArr.reduce((cookieObj: Record<string, string>, part: string) => {
		const [cookieName, cookieVal] = part.split('=')
		cookieObj[cookieName] = cookieVal
		return cookieObj
	}, {})
}

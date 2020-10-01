export const resolveQueryParams = (oldQueryParams: string, newQueryParams: string): string => {
	if (newQueryParams !== '') {
		const existingQueryParams = oldQueryParams ? oldQueryParams + '&' : oldQueryParams
		const mergedQueryParams = new URLSearchParams(existingQueryParams + newQueryParams)
		mergedQueryParams.forEach((val, key) => mergedQueryParams.set(key, val))
		return mergedQueryParams.toString()
	} else {
		return oldQueryParams
	}
}

export const removeProtocol = (url: string) => url.replace(/^https?:\/\//, '')

export const replaceProtocol = (url: string, protocol: string) => url.replace(/^https?:/, protocol)

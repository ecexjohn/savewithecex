import { getInstance, mapQueryParamsToQueryString } from './utils'
import { API_BASE_URL } from './config'

export function get(apiUrl, queryParams: any = undefined) {
	const headers = { Authorization: getInstance() }
	const urlSuffix = queryParams ? `?${mapQueryParamsToQueryString(queryParams)}` : ''
	return fetch(`${API_BASE_URL}${apiUrl}${urlSuffix}`, {
		headers,
	})
}

export function post(apiUrl, options, queryParams = undefined) {
	const headers = { Authorization: getInstance() }
	const urlSuffix = queryParams ? `?${mapQueryParamsToQueryString(queryParams)}` : ''
	return fetch(`${API_BASE_URL}${apiUrl}${urlSuffix}`, {
		method: 'post',
		headers,
		body: JSON.stringify(options),
	})
}

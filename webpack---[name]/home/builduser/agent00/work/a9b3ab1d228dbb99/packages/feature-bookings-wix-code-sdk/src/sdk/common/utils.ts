import { BOOKINGS_APP_DEF_ID } from './config'

export const getInstance = () => self['wix-site'].getAppToken(BOOKINGS_APP_DEF_ID)

export function mapQueryParamsToQueryString(queryParams) {
	const queryArray: Array<string> = []
	Object.keys(queryParams).forEach((key) => {
		queryArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
	})
	return queryArray.join('&')
}

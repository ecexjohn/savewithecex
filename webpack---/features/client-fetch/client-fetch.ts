import { Fetch, FetchFn, IFetchApi } from '@wix/thunderbolt-symbols'
import { toFormData } from '../../lib/toFormData'
import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Environment } from '../../types/Environment'
import { FetchCache } from './fetch-cache'

export function FetchApi(requestUrl: string, fetch: FetchFn, fetchCache: FetchCache): IFetchApi {
	function envFetch(url: string, init?: RequestInit) {
		return fetch(url, init)
	}

	return {
		getJson: <T>(url: string): Promise<T> => {
			const options = { headers: { referer: requestUrl } }
			return envFetch(url, options).then((x) => x.json())
		},
		postFormData(url: string, formData: any) {
			const data = toFormData(formData)
			return envFetch(url, {
				method: 'POST',
				body: data,
			}).then((x) => x.json())
		},
		envFetch,
		async getWithCacheInSsr(url: string) {
			const headers = { referer: requestUrl }
			const options = { headers }

			const fromCache = fetchCache.get(url)
			if (fromCache) {
				return Promise.resolve({ text: async () => fromCache, ok: true })
			}

			const result = await envFetch(url, options)

			if (result.ok) {
				const text = await result.text()
				if (text) {
					fetchCache.set(url, text)
					return { text: async () => text, ok: result.ok }
				}
			}

			return { text: result.text, ok: result.ok }
		},
	}
}

export const site = ({ fetchApi }: Environment): ContainerModuleLoader => (bind) => {
	bind(Fetch).toConstantValue(fetchApi)
}

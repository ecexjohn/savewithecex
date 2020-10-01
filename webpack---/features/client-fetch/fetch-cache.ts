import LRU from 'lru-cache'
import { MetricsReporter } from '@wix/ssr-metrics-reporter'

export interface FetchCache {
	get(url: string): string | undefined
	set(url: string, value: string): void
}

export function SsrFetchCache(fetchCache: LRU<string, string>, metricReporter: MetricsReporter): FetchCache {
	function report(name: string) {
		metricReporter.report(name)
	}

	return {
		get(url: string): string | undefined {
			report('fetchCache_get')
			const fromCache = fetchCache.get(url)

			if (fromCache) {
				report('fetchCache_hit')
			}
			return fromCache
		},
		set(url: string, value: string): void {
			fetchCache.set(url, value)
		},
	}
}

export function ClientFetchCache(): FetchCache {
	return {
		get(): string | undefined {
			return undefined
		},
		set(): void {},
	}
}

import { SiteAssetsMetricsReporter } from 'site-assets-client'

export const nopSiteAssetsMetricsReporter: () => SiteAssetsMetricsReporter = () => {
	return {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		reportAsyncWithCustomKey: <T>(asyncMethod: () => Promise<T>, methodName: string, key: string): Promise<T> => {
			return asyncMethod()
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		runAsyncAndReport: <T>(asyncMethod: () => Promise<T>, methodName: string): Promise<T> => {
			return asyncMethod()
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		runAndReport: <T>(method: () => T, methodName: string): T => {
			return method()
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		reportError: (err: Error): void => {},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		meter: (metricName: string): void => {},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		histogram: (metricName: string, value: number): void => {},
	}
}

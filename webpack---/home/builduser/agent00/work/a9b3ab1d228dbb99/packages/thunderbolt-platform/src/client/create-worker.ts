const {
	requestUrl,
	siteFeatures,
	siteFeaturesConfigs: { platform }
} = window.viewerModel
const platformOnSite = siteFeatures.includes('platform')
const isRunningPlatformWithWebWorker = !requestUrl.includes('experiments=runPlatformInMainThread')
const shouldCreateWebWorker = platformOnSite && isRunningPlatformWithWebWorker

async function createWorkerBlobUrl() {
	const res = await fetch(platform.clientWorkerUrl)
	const body = new Response(res.body)
	const blob = await body.blob()
	return URL.createObjectURL(blob)
}

async function createWorker() {
	const starMark = 'platform_create-worker started'
	performance.mark(starMark)
	const clientWorkerUrl = platform.clientWorkerUrl
	const url =
		clientWorkerUrl.startsWith('http://localhost:4200/') || clientWorkerUrl.startsWith('https://bo.wix.com/suricate/')
			? await createWorkerBlobUrl()
			: clientWorkerUrl.replace('https://static.parastorage.com/services/', '/_partials/')
	const platformWorker = new Worker(url)
	const endMark = 'platform_create-worker ended'
	performance.mark(endMark)
	performance.measure('Create Platform Web Worker', starMark, endMark)
	return platformWorker
}

export const platformWorkerPromise = shouldCreateWebWorker ? createWorker() : Promise.resolve()

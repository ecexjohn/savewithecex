import { IReporterApi } from '..'
import { IPageNumber } from 'feature-business-logger'

export async function reportPageView(
	reporterApi: IReporterApi,
	parsedUrl: URL,
	pageNumberHandler: IPageNumber,
	pageId: string
) {
	if (pageId === 'masterPage') {
		return
	}

	const pageNumber = pageNumberHandler.getPageNumber()
	const pageData = {
		pagePath: parsedUrl.pathname.concat(parsedUrl.search),
		pageTitle: window.document.title,
		pageId,
		pageNumber,
	}

	reporterApi.trackEvent({
		eventName: 'PageView',
		params: pageData,
		options: { reportToManagedChannels: true, context: { isFirstVisit: pageNumber === 1 } },
	})
}

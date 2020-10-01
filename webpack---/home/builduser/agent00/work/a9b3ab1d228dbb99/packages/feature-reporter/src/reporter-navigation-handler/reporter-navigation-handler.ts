import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPageDidMountHandler, pageIdSym } from '@wix/thunderbolt-symbols'
import { IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'
import { IReporterApi } from '../types'
import { ReporterSymbol } from '../symbols'
import { reportPageView } from './report-page-view'
import { IPageNumber, PageNumberSymbol } from 'feature-business-logger'

const reporterNavigationHandlerFactory = (
	reporterApi: IReporterApi,
	urlHistoryManager: IUrlHistoryManager,
	pageNumber: IPageNumber,
	pageId: string
): IPageDidMountHandler => ({
	pageDidMount: () => reportPageView(reporterApi, urlHistoryManager.getParsedUrl(), pageNumber, pageId),
})

export const ReporterNavigationHandler = withDependencies(
	[ReporterSymbol, UrlHistoryManagerSymbol, PageNumberSymbol, pageIdSym],
	reporterNavigationHandlerFactory
)

import {
	IAppWillLoadPageHandler,
	ILogger,
	IPageWillMountHandler,
	LifeCycle,
	LoggerSymbol,
} from '@wix/thunderbolt-symbols'
import { IPageProvider, PageProviderSymbol } from 'feature-pages'
import { ContainerModuleLoader, withDependencies } from '@wix/thunderbolt-ioc'
import { BatchingStrategy, BatchingStrategySymbol } from 'feature-react-renderer'

const pageInitializer = (
	pageProvider: IPageProvider,
	logger: ILogger,
	batchingStrategy: BatchingStrategy
): IAppWillLoadPageHandler => ({
	appWillLoadPage: async ({ pageId, contextId }) => {
		logger.phaseMark('init_page')
		const pageReflector = await pageProvider(contextId)
		const handlers = pageReflector.getAllImplementersOf<IPageWillMountHandler>(LifeCycle.PageWillMountHandler)
		await batchingStrategy.batchAsync(async () => {
			await Promise.all(handlers.map((handler) => handler.pageWillMount(pageId)))
		})
	},
})

export const site: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.AppWillLoadPageHandler).to(
		withDependencies([PageProviderSymbol, LoggerSymbol, BatchingStrategySymbol], pageInitializer)
	)
}

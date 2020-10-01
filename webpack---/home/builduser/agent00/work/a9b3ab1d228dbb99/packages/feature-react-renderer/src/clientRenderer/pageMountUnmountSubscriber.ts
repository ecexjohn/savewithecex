import {
	IAppWillLoadPageHandler,
	IPageDidMountHandler,
	IPageDidUnmountHandler,
	IPropsStore,
	LifeCycle,
	Props,
} from '@wix/thunderbolt-symbols'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { PageProviderSymbol, IPageProvider } from 'feature-pages'
import { BatchingStrategySymbol } from '../symbols'
import { BatchingStrategy } from '../types'

export const PageMountUnmountSubscriber = withDependencies(
	[Props, PageProviderSymbol, BatchingStrategySymbol],
	(
		props: IPropsStore,
		pageReflectorProvider: IPageProvider,
		batchingStrategy: BatchingStrategy
	): IAppWillLoadPageHandler => ({
		appWillLoadPage: async ({ pageId, contextId }) => {
			const pageReflector = await pageReflectorProvider(contextId)
			const pageDidMountHandlers = pageReflector.getAllImplementersOf<IPageDidMountHandler>(
				LifeCycle.PageDidMountHandler
			)
			const pageDidUnmountHandlers = pageReflector
				.getAllImplementersOf<IPageDidUnmountHandler>(LifeCycle.PageDidUnmountHandler)
				.map((m) => m.pageDidUnmount)

			props.update({
				[pageId]: {
					key: contextId,
					pageDidMount: (page: HTMLElement) =>
						batchingStrategy.batchAsync(async () => {
							if (page) {
								const funcs = await Promise.all(
									pageDidMountHandlers.map((pageDidMountHandler) =>
										pageDidMountHandler.pageDidMount(pageId, page)
									)
								)

								const unsubscribeFuncs = funcs.filter((x) => x) as Array<
									Exclude<typeof funcs[number], void>
								>
								pageDidUnmountHandlers.push(...unsubscribeFuncs)
							} else {
								await Promise.all(pageDidUnmountHandlers.map((pageDidUnmount) => pageDidUnmount()))
							}
						}),
				},
			})
		},
	})
)

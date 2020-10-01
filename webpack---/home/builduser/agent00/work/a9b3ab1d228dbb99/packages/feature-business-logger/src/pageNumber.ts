import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol, IAppWillLoadPageHandler } from '@wix/thunderbolt-symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { BsiManagerSymbol, name } from './symbols'
import { IBsiManager, IPageNumber, PageNumberState } from './types'

const pageNumberHandlerFactory = (
	featureState: IFeatureState<PageNumberState>,
	bsiManager: IBsiManager
): IAppWillLoadPageHandler & IPageNumber => ({
	appWillLoadPage: () => {
		const currentPageNumber = featureState.get()?.pageNumber || 0
		const nextPageNumber = currentPageNumber + 1
		featureState.update(() => ({
			pageNumber: nextPageNumber,
		}))
		bsiManager.reportActivity()
	},
	getPageNumber: () => featureState.get()?.pageNumber || 1,
})

export const PageNumberHandler = withDependencies(
	[named(FeatureStateSymbol, name), BsiManagerSymbol],
	pageNumberHandlerFactory
)

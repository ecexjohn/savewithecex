import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	FeatureStateSymbol,
	CurrentRouteInfoSymbol,
} from '@wix/thunderbolt-symbols'
import { SeoPageConfig, ISeoSiteApi } from './types'
import { name, SeoSiteSymbol } from './symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { ICurrentRouteInfo } from 'feature-router'

type SeoFeatureState = {
	didNavigate: boolean
}
declare global {
	interface Window {
		clientSideRender: boolean
	}
}

const initialState: SeoFeatureState = {
	didNavigate: false,
}

const shouldLoad = ({ didNavigate: isAfterNavigation }: SeoFeatureState): boolean => {
	const isInSSR = !process.env.browser
	const isClientFallback = !isInSSR && window.clientSideRender
	const noTitleExistsOnClient = !isInSSR && !document?.title?.length && !!document?.body
	return isInSSR || isAfterNavigation || isClientFallback || noTitleExistsOnClient
}

const seoPageFactory = (
	pageLevelSeoData: SeoPageConfig,
	featureState: IFeatureState<SeoFeatureState>,
	seoApi: ISeoSiteApi,
	routeApi: ICurrentRouteInfo
): IPageWillMountHandler => {
	return {
		pageWillMount: async () => {
			const state = featureState.get() || initialState
			seoApi.setPageData(pageLevelSeoData)
			seoApi.resetTpaAndCorvidData()
			const routeInfo = routeApi.getCurrentRouteInfo()
			routeInfo?.dynamicRouteData && (await seoApi.setDynamicRouteOverrides(routeInfo.dynamicRouteData))
			if (!shouldLoad(state)) {
				featureState.update(() => ({ didNavigate: true }))
				return
			}
			seoApi.renderSEO()
		},
	}
}

export const SeoPage = withDependencies(
	[named(PageFeatureConfigSymbol, name), named(FeatureStateSymbol, name), SeoSiteSymbol, CurrentRouteInfoSymbol],
	seoPageFactory
)

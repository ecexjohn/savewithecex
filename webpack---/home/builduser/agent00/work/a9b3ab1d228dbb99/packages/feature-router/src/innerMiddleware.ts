import { IRoutingMiddleware, IRoutingConfig } from './types'
import { errorPagesIds } from '@wix/thunderbolt-commons'

export const getInnerMiddleware = (routingConfig: IRoutingConfig) => {
	const pageJsonFileNameMiddleware: IRoutingMiddleware = {
		handle: async (routeInfo) => {
			if (!routeInfo.pageId) {
				throw new Error(`did not find the pageId for the requested url ${routeInfo.parsedUrl?.pathname}`)
			}

			const isErrorPage = errorPagesIds[routeInfo.pageId!]
			const pageJsonFileName = isErrorPage ? routeInfo.pageId : routingConfig.pages[routeInfo.pageId!]

			return {
				...routeInfo,
				pageJsonFileName,
			}
		},
	}

	const customNotFoundPageMiddleware: IRoutingMiddleware = {
		handle: async (routeInfo) => {
			if (
				(!routeInfo.pageId || routeInfo.pageId === errorPagesIds.__404__dp) &&
				routingConfig.customNotFoundPage?.pageId
			) {
				return {
					...routeInfo,
					pageId: routingConfig.customNotFoundPage?.pageId,
					relativeUrl: routingConfig.customNotFoundPage?.pageRoute,
				}
			}
			return routeInfo
		},
	}

	return {
		pageJsonFileNameMiddleware,
		customNotFoundPageMiddleware,
	}
}

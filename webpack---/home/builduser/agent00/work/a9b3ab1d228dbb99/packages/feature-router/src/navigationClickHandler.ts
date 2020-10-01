import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { IRouter } from './types'
import { name, Router } from './symbols'
import { ILinkClickHandler, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'

const navigationClickHandlerFactory = (router: IRouter): ILinkClickHandler => {
	return {
		handleClick: (anchor) => {
			const href = anchor.getAttribute('href')
			if (!href) {
				return false
			}
			if (anchor.getAttribute('target') === '_blank') {
				return false
			}
			const anchorDataId = anchor.getAttribute('data-anchor') || ''

			if (router.isInternalRoute(href)) {
				router.navigate(href, { anchorDataId })
				return true
			}
			return false
		},
	}
}

export const NavigationClickHandler = withDependencies(
	[Router, named(SiteFeatureConfigSymbol, name)],
	navigationClickHandlerFactory
)

import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ImageZoom } from './imageZoom'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { ImageZoomAPISymbol } from './symbols'
import { UrlChangeHandlerForPage } from 'feature-router'
import { ImageZoomAPIImpl } from './imageZoomAPI'
import { ImageZoomAPI } from './types'

export const page: ContainerModuleLoader = (bind, bindAll) => {
	bindAll(
		[
			LifeCycle.PageWillMountHandler,
			LifeCycle.PageDidMountHandler,
			LifeCycle.PageDidUnmountHandler,
			UrlChangeHandlerForPage,
		],
		ImageZoom
	)
	bind(ImageZoomAPISymbol).to(ImageZoomAPIImpl)
}

// Public Symbols
export { ImageZoomAPISymbol }

// Public Types
export { ImageZoomAPI }

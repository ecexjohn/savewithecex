import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPAPreloaderOverlay',
	loadComponent: () => import('./TPAPreloaderOverlay' /* webpackChunkName: "TPAPreloaderOverlay" */),
}

export default entry

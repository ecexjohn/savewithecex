import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPAUnavailableMessageOverlay',
	loadComponent: () =>
		import('./TPAUnavailableMessageOverlay' /* webpackChunkName: "TPAUnavailableMessageOverlay" */),
}

export default entry

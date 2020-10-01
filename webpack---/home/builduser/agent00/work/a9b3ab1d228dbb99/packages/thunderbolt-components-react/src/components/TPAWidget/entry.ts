import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPAWidget',
	loadComponent: () => import('./TPAWidget' /* webpackChunkName: "TPAWidget" */),
}

export default entry

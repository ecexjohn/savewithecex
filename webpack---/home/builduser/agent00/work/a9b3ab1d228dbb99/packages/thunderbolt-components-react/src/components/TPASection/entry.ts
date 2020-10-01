import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPASection',
	loadComponent: () => import('./TPASection' /* webpackChunkName: "TPASection" */),
}

export default entry

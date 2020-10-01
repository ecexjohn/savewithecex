import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPAMultiSection',
	loadComponent: () => import('./TPAMultiSection' /* webpackChunkName: "TPAMultiSection" */),
}

export default entry

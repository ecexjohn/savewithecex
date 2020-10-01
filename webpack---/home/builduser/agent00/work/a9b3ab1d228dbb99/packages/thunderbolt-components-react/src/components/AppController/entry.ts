import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'AppController',
	loadComponent: () => import('../DivWithChildren/DivWithChildren' /* webpackChunkName: "DivWithChildren" */),
}

export default entry

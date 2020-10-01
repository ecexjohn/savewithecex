import { ReporterState } from '.'
import { IFeatureState } from 'thunderbolt-feature-state'

export const setState = (featureState: IFeatureState<ReporterState>, partialState = {}) =>
	featureState.update((prevState: any) => Object.assign(prevState || {}, partialState))

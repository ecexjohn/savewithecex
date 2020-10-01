import _ from 'lodash'
import { BatchedUpdateFunction } from '../types'

type Batch = Parameters<BatchedUpdateFunction>[0]

export function batchUpdateFactory(batchedUpdateFunc: BatchedUpdateFunction, shouldScheduleFlush: boolean = true) {
	let batch: Batch = {}
	const flushUpdates = () => {
		if (!_.isEmpty(batch)) {
			batchedUpdateFunc(batch)
			batch = {}
		}
		shouldScheduleFlush = true
	}
	return {
		batchUpdate: (data: { [compId: string]: any }) => {
			Object.entries(data).forEach(([compId, val]) => {
				batch[compId] = batch[compId] || {}
				Object.assign(batch[compId], val)
			})
			if (shouldScheduleFlush) {
				setTimeout(flushUpdates, 0)
				shouldScheduleFlush = false
			}
		},
		flushUpdates
	}
}

import { withDependencies } from '@wix/thunderbolt-ioc'
import ReactDOM from 'react-dom'
import { BatchingStrategy } from '../types'

const createBatchingStrategy = (batchingFunction: (update: () => void) => void): BatchingStrategy => {
	let promise: Promise<void> | null = null
	const batchingStrategy: BatchingStrategy = {
		batch: (fn) => {
			if (!promise) {
				batchingFunction(fn)
			} else {
				promise.then(() => {
					batchingFunction(fn)
				})
			}
		},
		batchAsync: async (callback) => {
			promise = Promise.resolve().then(callback)
			await promise
			promise = null
		},
	}
	return batchingStrategy
}

export const ClientBatchingStrategy = withDependencies<BatchingStrategy>([], () =>
	createBatchingStrategy((fn) => {
		ReactDOM.unstable_batchedUpdates(fn)
	})
)

export const ServerBatchingStrategy = withDependencies<BatchingStrategy>([], () =>
	createBatchingStrategy((fn) => {
		fn()
	})
)

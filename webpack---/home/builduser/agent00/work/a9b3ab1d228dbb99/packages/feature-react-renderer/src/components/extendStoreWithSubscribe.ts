import { BatchingStrategy, StoreWithSubscribe } from '../types'
import { StoreNoUpdate } from '@wix/thunderbolt-symbols'

type Subscriber = (partialStore: Record<string, any>) => void
type Subscribers = Array<Subscriber>
type SomeCollection = Record<string, any>

export function extendStoreWithSubscribe<StoreType extends StoreNoUpdate<SomeCollection>>(
	store: StoreType,
	batchingStrategy: BatchingStrategy
): StoreWithSubscribe<StoreType> {
	const subscribers: Record<string, Subscribers> = {}

	function notifyComponents(partialStore: SomeCollection) {
		batchingStrategy.batch(() => {
			Object.keys(partialStore).forEach(
				(compId) =>
					subscribers[compId] &&
					[...subscribers[compId]].forEach((cb) => {
						cb(partialStore[compId])
					})
			)
		})
	}

	store.subscribeToChanges((partial: SomeCollection) => notifyComponents(partial))

	const subscribeById = (id: string, cb: Subscriber) => {
		subscribers[id] = subscribers[id] || []
		subscribers[id].push(cb)
		return () => {
			const index = subscribers[id].indexOf(cb)
			subscribers[id].splice(index, 1)
		}
	}

	return {
		...store,
		subscribeById,
	}
}

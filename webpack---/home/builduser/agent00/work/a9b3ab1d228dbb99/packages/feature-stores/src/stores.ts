import { Store, Subscriber } from '@wix/thunderbolt-symbols'
import { getFullId } from '@wix/thunderbolt-commons'

type Subscribers<T> = Array<Subscriber<T>>

export const getStore = <T extends { [key: string]: any }>(): Store<T> => {
	let stores = [] as Array<{ id: string; store: T }>
	let generalStore = {} as T

	const getPageStore = (id: string): T => {
		// Although we use Array.find the number of stores is 3 at most (page, masterPage and a lightbox) which means that we are still at O(1)
		const pageStore = stores.find(({ store }) => store[id]) || stores.find(({ store }) => store[getFullId(id)])

		return pageStore ? pageStore.store : generalStore
	}

	const getContextIdOfCompId = (compId: string): string | null => {
		const pageStore = getPageStore(compId)
		if (pageStore === generalStore) {
			return null
		}
		const { id } = stores.find(({ store }) => store === pageStore)!
		return id
	}

	const subscribers: Subscribers<T> = []
	const update = (partialStore: T) => {
		const partialStoreWithCompleteEntries = Object.entries(partialStore).reduce((acc, [compId, value]) => {
			const pageStore = getPageStore(compId)
			pageStore[compId as keyof T] = { ...pageStore[compId], ...value }

			return { ...acc, [compId]: pageStore[compId] }
		}, {} as T)

		subscribers.forEach((cb) => {
			cb(partialStoreWithCompleteEntries)
		})
	}

	return {
		get: (id: string) => {
			const pageStore = getPageStore(id)!
			return pageStore[id]
		},
		getContextIdOfCompId,
		setChildStore: (contextId: string, store?: T) => {
			stores = stores.filter(({ id }) => id !== contextId)
			if (store) {
				const storesItem = { id: contextId, store: { ...store } }
				stores = [storesItem, ...stores]

				// Apply changes made before adding the page to the store
				generalStore = Object.entries(generalStore).reduce((acc, [compId, value]) => {
					if (store[compId] || store[getFullId(compId)]) {
						storesItem.store[compId as keyof T] = { ...storesItem.store[compId], ...value }
						return acc
					}

					return { ...acc, [compId]: value }
				}, {} as T)
			}
		},
		getEntireStore: () => Object.assign({}, ...stores.map(({ store }) => store), generalStore),
		update,
		subscribeToChanges: (cb: Subscriber<T>) => {
			subscribers.push(cb)
		},
	}
}

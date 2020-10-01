import _ from 'lodash'
import { StorageInitData } from './storage'

export function createStorageAPI(appPrefix: string, handlers: any, storageStore: StorageInitData): any {
	enum TYPES {
		LOCAL = 'local',
		SESSION = 'session',
		MEMORY = 'memory'
	}

	const store = {}

	_.set(store, `${TYPES.LOCAL}Storage`, _.get(storageStore, TYPES.LOCAL))
	_.set(store, `${TYPES.SESSION}Storage`, _.get(storageStore, TYPES.SESSION))

	const memory = {
		setItem: (key: string, value: string) => setItemImp(TYPES.MEMORY, store, key, value),
		getItem: (key: string) => getItemImp(TYPES.MEMORY, store, key),
		removeItem: (key: string) => removeItemImp(TYPES.MEMORY, store, key),
		clear: () => clearImp(TYPES.MEMORY, store)
	}

	const session = {
		setItem: (key: string, value: string) => setItemImp(TYPES.SESSION, store, key, value),
		getItem: (key: string) => getItemImp(TYPES.SESSION, store, key),
		removeItem: (key: string) => removeItemImp(TYPES.SESSION, store, key),
		clear: () => clearImp(TYPES.SESSION, store)
	}

	const local = {
		setItem: (key: string, value: string) => setItemImp(TYPES.LOCAL, store, key, value),
		getItem: (key: string) => getItemImp(TYPES.LOCAL, store, key),
		removeItem: (key: string) => removeItemImp(TYPES.LOCAL, store, key),
		clear: () => clearImp(TYPES.LOCAL, store)
	}

	const setItemImp = (type: TYPES, storageObject: object, key: string, value: string) => {
		if (!process.env.browser) {
			return
		}

		const newData = { [String(key)]: String(value) }
		const appDataToStore = JSON.stringify(_.assign({}, getParsedStoredAppData(type, storageObject), newData))
		const maxDataSize = type === TYPES.MEMORY ? 1000000 : 50000
		if (appDataToStore.length > maxDataSize) {
			throw new Error('QuotaExceededError - app storage limit is 50kb')
		}
		_.set(storageObject, [`${type}Storage`, appPrefix], appDataToStore)
		switch (type) {
			default:
				break
			case TYPES.SESSION:
				handlers.sessionSetItem(appPrefix, _.get(storageObject, [`${type}Storage`, appPrefix]))
				break
			case TYPES.LOCAL:
				handlers.localSetItem(appPrefix, _.get(storageObject, [`${type}Storage`, appPrefix]))
				break
		}
	}

	const getItemImp = (type: TYPES, storageObject: object, key: string) => {
		if (!process.env.browser) {
			return null
		}

		const storedAppData = getParsedStoredAppData(type, storageObject)
		return _.get(storedAppData, String(key), null)
	}

	const removeItemImp = (type: TYPES, storageObject: object, key: string) => {
		if (!process.env.browser) {
			return
		}

		const storedAppData = getParsedStoredAppData(type, storageObject)
		const appDataToStore = JSON.stringify(_.omit(storedAppData, key))

		_.set(storageObject, [`${type}Storage`, appPrefix], appDataToStore)
		switch (type) {
			default:
				break
			case TYPES.SESSION:
				handlers.sessionSetItem(appPrefix, _.get(storageObject, [`${type}Storage`, appPrefix]))
				break
			case TYPES.LOCAL:
				handlers.localSetItem(appPrefix, _.get(storageObject, [`${type}Storage`, appPrefix]))
				break
		}
	}

	const clearImp = (type: TYPES, storageObject: object) => {
		if (!process.env.browser) {
			return
		}

		const appDataToStore = '{}'
		_.set(storageObject, [`${type}Storage`, appPrefix], appDataToStore)
		switch (type) {
			default:
				break
			case TYPES.SESSION:
				handlers.sessionSetItem(appPrefix, appDataToStore)
				break
			case TYPES.LOCAL:
				handlers.localSetItem(appPrefix, appDataToStore)
				break
			case TYPES.MEMORY:
				handlers.memorySetItem(appPrefix, appDataToStore)
				break
		}
	}

	const getParsedStoredAppData = (type: TYPES, storageObject: object) => {
		return JSON.parse(_.get(storageObject, [`${type}Storage`, appPrefix], '{}'))
	}

	return {
		memory,
		session,
		local
	}
}

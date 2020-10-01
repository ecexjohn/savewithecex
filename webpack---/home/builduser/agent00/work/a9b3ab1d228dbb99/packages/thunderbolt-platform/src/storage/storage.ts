import _ from 'lodash'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindowSymbol, BrowserWindow, SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import MemoryStorage from './MemoryStorage'
import { SessionStorage } from './SessionStorage'
import { LocalStorage } from './LocalStorage'

export type StorageInitData = { local: any; session: any }
export interface IPlatformStorage {
	getStore(): StorageInitData
}

const prefix = 'platform_app_'
function getPlatformStorage(storage: any) {
	const scopedValues = {}
	const filteredKeys = Object.keys(storage).filter((keyName) => typeof keyName === 'string' && _.startsWith(keyName, prefix))
	for (const keyName of filteredKeys) {
		_.set(scopedValues, keyName.replace(prefix, ''), storage.getItem(keyName))
	}
	return scopedValues
}

function isStorageSupported(window: BrowserWindow) {
	try {
		window!.localStorage.setItem('', '')
		window!.localStorage.removeItem('')
		return true
	} catch (e) {
		return false
	}
}

type StoragePlatformHandlers = {
	memorySetItem: (key: string, value: string) => void
	sessionSetItem: (key: string, value: string) => void
	localSetItem: (key: string, value: string) => void
}
export const Storage = withDependencies([BrowserWindowSymbol], (window: BrowserWindow): IPlatformStorage & SdkHandlersProvider<StoragePlatformHandlers> => {
	const storageSupported = process.env.browser ? isStorageSupported(window) : false

	const memoryStorage = new MemoryStorage()
	const sessionStorage = storageSupported ? SessionStorage(window) : new MemoryStorage()
	const localStorage = storageSupported ? LocalStorage(window) : new MemoryStorage()

	return {
		getSdkHandlers: () => ({
			memorySetItem(key, value) {
				memoryStorage.setItem(prefix + key, value)
			},
			sessionSetItem(key, value) {
				sessionStorage.setItem(prefix + key, value)
			},
			localSetItem(key, value) {
				localStorage.setItem(prefix + key, value)
			}
		}),
		getStore() {
			return process.env.browser
				? {
						local: getPlatformStorage(localStorage.getStorage()),
						session: getPlatformStorage(sessionStorage.getStorage())
				  }
				: {
						local: {},
						session: {}
				  }
		}
	}
})

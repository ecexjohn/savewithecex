import _ from 'lodash'
// @ts-ignore TODO remove all utils from platform APIs. let apps bundle their utils dependencies.
import { mediaItemUtils } from 'santa-platform-utils'
import { PlatformAPI, PlatformUtils } from '@wix/thunderbolt-symbols'
import { LinkData } from '@wix/thunderbolt-becky-types'
import { BootstrapData } from '../../types'
import { createStorageAPI } from '../../storage/storageAPI'

const { types, parseMediaItemUri } = mediaItemUtils

// BOLT: https://github.com/wix-private/bolt/blob/c83dc8f4b36f78e7b9c52eec63afdee045b34ecc/viewer-platform-worker/src/utils/platformUtilities.js#L5
export function createPlatformApi(bootstrapData: BootstrapData, platformUtils: PlatformUtils, handlers: any): (appDefinitionId: string, instanceId: string) => PlatformAPI {
	return (appDefinitionId: string, instanceId: string) => {
		const pubSub = process.env.browser
			? {
					subscribe: (eventKey: string, cb: Function, isPersistent: boolean) => {
						handlers.subscribe(appDefinitionId, eventKey, cb, isPersistent)
					},
					unsubscribe: (eventKey: string) => {
						handlers.unsubscribe(appDefinitionId, eventKey)
					},
					publish: (eventKey: string, data: any, isPersistent: boolean) => {
						handlers.publish(appDefinitionId, eventKey, data, isPersistent)
					}
			  }
			: {
					subscribe: _.noop,
					unsubscribe: _.noop,
					publish: _.noop
			  }

		return {
			links: {
				toUrl: (linkObject: LinkData) => platformUtils.linkUtils.getLinkUrlFromDataItem(linkObject)
			},
			storage: createStorageAPI(`${appDefinitionId}_${instanceId}`, handlers, bootstrapData.storageInitData),
			pubSub,
			mediaItemUtils: {
				types,
				parseMediaItemUri
			}
		}
	}
}

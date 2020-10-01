import _ from 'lodash'
import { PlatformEnvData, PlatformUtils, WixCodeApi, FeatureName } from '@wix/thunderbolt-symbols'
import { WixCodeViewerAppUtils } from './wixCodeViewerAppUtils'
import { BootstrapData } from '../types'
import { Model } from './types'
import { wixCodeSdkFactories } from '../wixCodeSdks'

export async function createWixCodeApi({
	bootstrapData,
	wixCodeViewerAppUtils,
	models,
	platformUtils,
	createSdkHandlers,
	platformEnvData
}: {
	bootstrapData: BootstrapData
	wixCodeViewerAppUtils: WixCodeViewerAppUtils
	models: Model
	platformUtils: PlatformUtils
	createSdkHandlers: (pageId: string) => any
	platformEnvData: PlatformEnvData
}): Promise<WixCodeApi> {
	const internalNamespaces = {
		// TODO: move this somewhere else
		events: {
			setStaticEventHandlers: wixCodeViewerAppUtils.setStaticEventHandlers
		}
	}
	const wixCodeSdkArray = await Promise.all(
		_.map(wixCodeSdkFactories, async (loader, name: FeatureName) => {
			const featurePageConfig = models.pageConfig[name] || {}
			const featureSdkData = bootstrapData.wixCodeSdkProviderData[name] || {} // TODO: remove this once migration is done
			const featureSiteConfig = bootstrapData.sdkFactoriesSiteFeatureConfigs[name] || {}
			const featureData = { ...featurePageConfig, ...featureSdkData, ...featureSiteConfig } // Will eventually include only page and site config
			const sdkFactory = await loader()
			return sdkFactory(featureData, createSdkHandlers(bootstrapData.currentPageId), platformUtils, platformEnvData)
		})
	)
	return Object.assign(internalNamespaces, ...wixCodeSdkArray)
}

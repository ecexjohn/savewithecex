import { BootstrapData } from '../../../types'
import { PlatformEnvData } from '@wix/thunderbolt-symbols'

export const biFactory = ({
	biData,
	platformServicesBiData,
	viewMode
}: {
	biData: PlatformEnvData['bi']
	platformServicesBiData: BootstrapData['platformServicesAPIData']['bi']
	viewMode: 'site' | 'preview'
}) => {
	const {
		msId: metaSiteId,
		viewerSessionId,
		visitorId,
		siteMemberId,
		requestId,
		initialTimestamp,
		initialRequestTimestamp,
		isCached,
		is_rollout,
		dc,
		viewerVersion,
		pageData: { isLightbox, pageUrl, pageId, pageNumber },
		muteBi
	} = biData
	const { ownerId, isMobileFriendly, isPreview } = platformServicesBiData

	return {
		// wixBiSession data
		viewerSessionId,
		visitorId,
		requestId,
		siteMemberId,
		isCached,
		is_rollout,
		dc,
		pageLoadStart: initialTimestamp,
		networkPageLoadStart: initialRequestTimestamp,
		ssrRequestTimestamp: 0, // TODO not implemented yet in ssr
		coin: 0, // TODO wixBiSession.coin
		pageNumber,
		// rendererModel data
		metaSiteId,
		ownerId,
		isMobileFriendly,
		viewMode,
		isPreview,
		// viewer data
		pageId,
		pageUrl,
		isServerSide: !process.env.browser,
		viewerName: 'thunderbolt',
		artifactVersion: `thunderbolt-${viewerVersion}`,
		isPopup: isLightbox,
		// query params data
		muteBi
	}
}

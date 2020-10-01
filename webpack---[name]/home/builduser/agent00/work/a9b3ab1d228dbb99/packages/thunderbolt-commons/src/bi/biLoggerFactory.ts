import { factory } from '@wix/web-bi-logger'
import { PublishMethods } from '@wix/web-bi-logger/dist/src/logger' // eslint-disable-line no-restricted-syntax
import { FetchFn } from '@wix/thunderbolt-symbols'
import { FactoryOptions, BaseFactory } from './types'

/**
 * Base BI logger factory, should be used as a basis for any BI logger in the Viewer
 *
 * - Initialized with base defaults (which are supported globally in the BI schema).
 * - Any additional defaults should be added via specialized factories, like FedOps,
 *   and only after making sure the BI schema supports them.
 *
 * Please use #bi-logger-support for any questions
 */
const createBaseBiLoggerFactory = ({
	useBatch = true,
	publishMethod = process.env.browser ? PublishMethods.Auto : PublishMethods.Fetch,
	endpoint,
	muteBi = false,
	biStore,
	sessionManager,
	fetch,
}: FactoryOptions): BaseFactory => {
	const biLoggerFactory = factory({ useBatch, publishMethod, endpoint })
		.setMuted(process.env.browser ? muteBi : true)
		.withUoUContext({
			msid: biStore.msid,
		})
		.withNonEssentialContext({
			visitorId: () => (sessionManager && sessionManager.getVisitorId()) || (biStore.visitorId as string),
			siteMemberId: () =>
				(sessionManager && sessionManager.getSiteMemberId()) || (biStore.siteMemberId as string),
		})
		.updateDefaults({
			vsi: biStore.viewerSessionId,
			rid: biStore.requestId,
			_av: `thunderbolt-${biStore.viewerVersion}`,
		})

	if (!process.env.browser) {
		const fetchWithProtocol: FetchFn = (url, options) => fetch(`https:${url}`, options)
		biLoggerFactory.withPublishFunction({
			[PublishMethods.Fetch]: fetchWithProtocol,
		})
	}

	return biLoggerFactory
}

/**
 * BI logger factory for FedOps
 *
 * - Initialized with base defaults + defaults which are supported by FedOps BI events
 *   https://bo.wix.com/bi-catalog-webapp/#/sources/72
 *
 * - Any additional defaults should be added only after making sure the BI schema supports them
 *
 * Please use #bi-logger-support for any questions
 */
const createBiLoggerFactoryForFedops = (options: FactoryOptions) => {
	const {
		biStore: { initialTimestamp, initialRequestTimestamp, dc, is_headless, isCached, pageData, rolloutData },
	} = options

	return createBaseBiLoggerFactory(options).updateDefaults({
		ts: () => Date.now() - initialTimestamp,
		// this computation is worker compatible cause performance.now() in the worker is computed from worker initialization time
		tsn: () => Date.now() - initialRequestTimestamp,
		dc,
		ish: is_headless,
		pn: pageData.pageNumber,
		pageId: pageData.pageId,
		pageUrl: pageData.pageUrl,
		isServerSide: !process.env.browser,
		is_lightbox: pageData.isLightbox,
		is_cached: isCached,
		is_sav_rollout: rolloutData.siteAssetsVersionsRollout ? 1 : 0,
		is_dac_rollout: rolloutData.isDACRollout ? 1 : 0,
		is_rollout: rolloutData.isTBRollout,
	})
}

export const commonBiLoggerFactory = {
	createBaseBiLoggerFactory,
	createBiLoggerFactoryForFedops,
}

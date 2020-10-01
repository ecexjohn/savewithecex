import { withDependencies } from '@wix/thunderbolt-ioc'
import { WixBiSessionSymbol, WixBiSession, IFetchApi, Fetch } from '@wix/thunderbolt-symbols'
import { commonBiLoggerFactory } from '@wix/thunderbolt-commons'
import { SessionManagerSymbol, ISessionManager } from 'feature-session-manager'
import { BsiManagerSymbol } from './symbols'
import { IBsiManager, BusinessLogger } from './types'

declare global {
	interface Window {
		thunderboltVersion: string
	}
}

/**
 * BI logger for business events
 *
 * - Initialized with base defaults + bsi (which are supported globally in the BI schema).
 * - Any additional defaults should be added only after making sure the BI schema supports them.
 *
 * Usage: businessLogger.logger.log({src: <SRC>, evid: <EVID>, ...<PARAMS>}, {endpoint: <PROJECT ENDPOINT>})
 *
 * Please use #bi-logger-support for any questions
 */
export const BusinessLoggerFactory = withDependencies(
	process.env.browser
		? [WixBiSessionSymbol, SessionManagerSymbol, Fetch, BsiManagerSymbol]
		: [WixBiSessionSymbol, SessionManagerSymbol, Fetch],
	(
		wixBiSession: WixBiSession,
		sessionManager: ISessionManager,
		fetchApi: IFetchApi,
		bsiManager: IBsiManager
	): BusinessLogger => {
		const {
			initialTimestamp,
			initialRequestTimestamp,
			dc,
			viewerSessionId,
			requestId,
			is_rollout,
			isCached,
			msId,
		} = wixBiSession

		const biStore = {
			msid: msId,
			viewerSessionId,
			requestId,
			initialTimestamp,
			initialRequestTimestamp,
			dc,
			is_rollout,
			isCached,
			is_headless: false,
			viewerVersion: process.env.browser ? window.thunderboltVersion : process.env.APP_VERSION!,
			rolloutData: {
				// TODO @shahaf
				siteAssetsVersionsRollout: false,
				isDACRollout: false,
				isTBRollout: false,
			},
			pageData: {
				// TODO @shahaf
				pageNumber: 0,
				pageId: 'TODO',
				pageUrl: 'TODO',
				isLightbox: false,
			},
		}

		const biLoggerFactory = commonBiLoggerFactory.createBaseBiLoggerFactory({
			biStore,
			sessionManager,
			useBatch: false,
			fetch: fetchApi.envFetch,
		})

		if (process.env.browser) {
			biLoggerFactory.withNonEssentialContext({
				bsi: () => bsiManager.getBsi(),
			})
		}

		return {
			logger: biLoggerFactory.logger(),
		}
	}
)

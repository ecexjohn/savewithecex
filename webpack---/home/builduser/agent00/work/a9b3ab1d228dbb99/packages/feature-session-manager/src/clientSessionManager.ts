import _ from 'lodash'
import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import {
	Fetch,
	IFetchApi,
	SiteFeatureConfigSymbol,
	ILogger,
	LoggerSymbol,
	SdkHandlersProvider,
	BrowserWindowSymbol,
} from '@wix/thunderbolt-symbols'
import {
	SessionManagerSiteConfig,
	DynamicSessionModel,
	ISessionManager,
	SessionHandlers,
	LoadNewSessionReason,
	OnLoadSessionCallback,
} from './types'
import { name, DynamicSessionModelSymbol } from './symbols'

const DEFAULT_EXPIRATION_TIME = 210 * 60 * 1000 // 210 minutes = 3.5 hours

const sessionManagerFactory = (
	browserWindowSymbol: Window,
	siteFeatureConfig: SessionManagerSiteConfig,
	fetchApi: IFetchApi,
	logger: ILogger,
	dynamicSessionModel?: DynamicSessionModel
): ISessionManager & SdkHandlersProvider<SessionHandlers> => {
	let sessionTimeoutPointer: number

	const _onLoadSessionCallbacks: Array<OnLoadSessionCallback> = []

	const addLoadNewSessionCallback = (callback: OnLoadSessionCallback) => {
		_onLoadSessionCallbacks.push(callback)
	}

	const _sessionModel: Partial<DynamicSessionModel> = {
		...dynamicSessionModel,
	}

	const getAppInstanceByAppDefId = (
		appDefId: string,
		sessionModel: Partial<DynamicSessionModel>
	): string | undefined => {
		const { instance } = (sessionModel.apps && sessionModel.apps[appDefId]) || {}
		return instance
	}

	const invokeSessionLoadCallbacks = (reason: LoadNewSessionReason) => {
		const instances = _.mapValues(_sessionModel.apps, 'instance')
		_onLoadSessionCallbacks.forEach((callback) => callback({ results: instances, reason }))
	}

	const loadNewSession: ISessionManager['loadNewSession'] = async ({ reason } = { reason: 'noSpecificReason' }) => {
		try {
			const newSession = await fetchApi.getJson<DynamicSessionModel>(siteFeatureConfig.dynamicModelApiUrl)
			Object.assign(_sessionModel, newSession)
			invokeSessionLoadCallbacks(reason)
		} catch (error) {
			logger.captureError(error, { tags: { feature: 'session-manager' } })
		}

		setSessionTimeout()
	}

	const setSessionTimeout = () => {
		if (sessionTimeoutPointer) {
			browserWindowSymbol.clearTimeout(sessionTimeoutPointer)
		}

		sessionTimeoutPointer = browserWindowSymbol.setTimeout(
			() => loadNewSession({ reason: 'expiry' }),
			siteFeatureConfig.expiryTimeoutOverride || DEFAULT_EXPIRATION_TIME
		)
	}

	// set initial timeout for refresh
	setSessionTimeout()

	return {
		getAllInstances() {
			return _sessionModel.apps || {}
		},
		getAppInstanceByAppDefId(appDefId: string) {
			return getAppInstanceByAppDefId(appDefId, _sessionModel)
		},
		getSiteMemberId() {
			return _sessionModel.siteMemberId
		},
		getVisitorId() {
			return _sessionModel.visitorId
		},
		loadNewSession,
		addLoadNewSessionCallback,
		getHubSecurityToken() {
			return String(_sessionModel.hs || 'NO_HS')
		},
		getUserSession() {
			return _sessionModel.svSession
		},
		getCtToken() {
			return _sessionModel.ctToken
		},
		setUserSession(svSession: string) {
			_sessionModel.svSession = svSession
		},
		getSdkHandlers: () => ({
			onLoadSession: (callback: OnLoadSessionCallback) => {
				addLoadNewSessionCallback(callback)
			},
			getMediaAuthToken: () => Promise.resolve(_sessionModel.mediaAuthToken),
			loadNewSession,
		}),
	}
}

export const SessionManager = withDependencies(
	[
		BrowserWindowSymbol,
		named(SiteFeatureConfigSymbol, name),
		Fetch,
		LoggerSymbol,
		optional(DynamicSessionModelSymbol),
	],
	sessionManagerFactory
)

import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	SiteFeatureConfigSymbol,
	SdkHandlersProvider,
	IPageDidMountHandler,
	LoggerSymbol,
	ILogger,
} from '@wix/thunderbolt-symbols'
import { name } from '../symbols'
import { Apis } from '../user/utils'
import {
	SiteMembersWixCodeSdkFactoryData,
	SiteMembersWixCodeSdkHandlers,
	SiteMembersWixCodeSdkSiteConfig,
	MemberDTO,
} from '../types'
import { ISiteMembersApi, SiteMembersApiSymbol, PrivacyStatus, INTERACTIONS } from 'feature-site-members'
import { SessionManagerSymbol, ISessionManager } from 'feature-session-manager'
import { ConsentPolicySymbol, IConsentPolicy, ConsentPolicyUpdatesListener } from 'feature-consent-policy'
import { validateEmailUserParams } from './validations'

const SiteMembersWixCodeSdkParamsProvider = (
	{ svSession }: SiteMembersWixCodeSdkSiteConfig,
	sessionManager: ISessionManager,
	consentPolicyApi: IConsentPolicy
): {
	siteMembersWixCodeSdk: { initialState: SiteMembersWixCodeSdkFactoryData }
} => {
	const wixCodeAppDefinitionId = '675bbcef-18d8-41f5-800e-131ec9e08762'
	const authorization = sessionManager.getAppInstanceByAppDefId(wixCodeAppDefinitionId)

	const consentPolicyDetails = consentPolicyApi.getCurrentConsentPolicy()
	const consentPolicyHeaderObject = consentPolicyApi._getConsentPolicyHeader()
	return {
		[name]: {
			initialState: {
				svSession,
				authorization,
				consentPolicyDetails,
				consentPolicyHeaderObject,
			},
		},
	}
}

const SiteMembersWixCodeSdkHandlersFactory = (
	{
		login,
		promptLogin,
		promptForgotPassword,
		applySessionToken,
		getMemberDetails,
		register,
		registerToUserLogin,
		logout,
		handleOauthToken,
	}: ISiteMembersApi,
	sessionManager: ISessionManager,
	logger: ILogger,
	consentPolicyApi: IConsentPolicy
): SdkHandlersProvider<SiteMembersWixCodeSdkHandlers> & IPageDidMountHandler => {
	const wixCodeAppDefinitionId = '675bbcef-18d8-41f5-800e-131ec9e08762'
	const authorization = sessionManager.getAppInstanceByAppDefId(wixCodeAppDefinitionId)

	const sdkListeners: Array<ConsentPolicyUpdatesListener> = []
	const consentUpdatesListener: ConsentPolicyUpdatesListener = (policyDetails, policyHeaderObject) => {
		sdkListeners.forEach((listener) => listener(policyDetails, policyHeaderObject))
	}
	return {
		pageDidMount() {
			const unregister = consentPolicyApi.registerToChanges(consentUpdatesListener)
			return () => unregister()
		},
		getSdkHandlers() {
			return {
				async login(email, password) {
					logger.interactionStarted(INTERACTIONS.CODE_LOGIN)
					const response = await login(email, password)
					logger.interactionStarted(INTERACTIONS.CODE_LOGIN)
					return response
				},
				applySessionToken,
				async emailUser(emailId, toUser, options) {
					const { processedOptions } = validateEmailUserParams(emailId, toUser, options)
					const params = { emailId, contactId: toUser, options: processedOptions }
					await fetch(Apis.sendUserEmailApi, {
						method: 'POST',
						headers: { authorization: authorization || '' },
						body: JSON.stringify(params),
					})
				},
				promptForgotPassword,
				async promptLogin(options) {
					const { member } = await promptLogin(options)
					return member as MemberDTO // TODO: Maybe consolidate these almost identical types?
				},
				async register(email, password, options) {
					const { member, approvalToken, status } = await register(
						email,
						password,
						options?.contactInfo || { customFields: [] },
						options.privacyStatus || PrivacyStatus.PRIVATE
					)

					return {
						status,
						approvalToken,
						user: member,
					}
				},
				registerToUserLogin,
				logout,
				getMemberDetails,
				handleOauthToken,
				registerToConsentPolicyChanges(listener) {
					sdkListeners.push(listener)
				},
				setConsentPolicy(policy) {
					return consentPolicyApi.setConsentPolicy(policy)
				},
				resetConsentPolicy() {
					return consentPolicyApi.resetConsentPolicy()
				},
			}
		},
	}
}

/**
 * you may depend on any symbol from https://github.com/wix-private/thunderbolt/tree/7b409d8d1b75a570fee8b84f46ce7db0d9a8bfae/packages/thunderbolt-symbols/src/symbols
 */
export const siteMembersWixCodeSdkParamsProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name), SessionManagerSymbol, ConsentPolicySymbol],
	SiteMembersWixCodeSdkParamsProvider
)

export const siteMembersWixCodeSdkHandlers = withDependencies(
	[SiteMembersApiSymbol, SessionManagerSymbol, LoggerSymbol, ConsentPolicySymbol],
	SiteMembersWixCodeSdkHandlersFactory
)

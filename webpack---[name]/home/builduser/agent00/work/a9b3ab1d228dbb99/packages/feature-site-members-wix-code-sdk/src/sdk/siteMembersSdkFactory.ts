import { PolicyDetails, PolicyHeaderObject } from '@wix/cookie-consent-policy-client'

import {
	SiteMembersWixCodeSdkFactoryData,
	SiteMembersWixCodeSdkHandlers,
	SiteMembersWixCodeSdkWixCodeApi,
	REGISTRATION_RESULT_STATUS_DISPLAY,
	LoginHandler,
	ConsentPolicyChangedHandler,
} from '../types'
import { namespace } from '../symbols'
import { User } from '../user/user'

export async function SiteMembersSdkFactory(
	{ authorization, svSession, consentPolicyDetails, consentPolicyHeaderObject }: SiteMembersWixCodeSdkFactoryData,
	{
		login,
		applySessionToken,
		emailUser,
		promptForgotPassword,
		promptLogin,
		register,
		registerToUserLogin,
		logout,
		getMemberDetails,
		handleOauthToken,
		setConsentPolicy,
		resetConsentPolicy,
		registerToConsentPolicyChanges,
	}: SiteMembersWixCodeSdkHandlers
): Promise<{ [namespace]: SiteMembersWixCodeSdkWixCodeApi }> {
	const memberDetails = await getMemberDetails()
	const currentUser = new User(
		{ ...memberDetails, uid: memberDetails?.id, svSession },
		memberDetails ? REGISTRATION_RESULT_STATUS_DISPLAY[memberDetails.status] : undefined,
		authorization
	)
	let onLogin: Array<LoginHandler> = []

	const clonePolicyDetails = (policyDetails: PolicyDetails) => ({
		...policyDetails,
		policy: {
			...policyDetails.policy,
		},
	})

	const clonePolicyHeaderObject = (policyHeaderObject: PolicyHeaderObject) => ({
		...policyHeaderObject,
	})

	const consentPolicyChangedHandlers: Array<ConsentPolicyChangedHandler> = []

	const api: SiteMembersWixCodeSdkWixCodeApi = {
		currentUser,
		async login(email, password) {
			await login(email, password)
		},
		applySessionToken,
		emailUser,
		promptForgotPassword,
		promptLogin,
		async register(email, password, options = {}) {
			try {
				const data = await register(email, password, options)
				return {
					status: data.status,
					...(data.approvalToken ? { approvalToken: data.approvalToken } : {}),
					user: new User(
						{
							uid: data.user?.id,
							svSession,
							...data.user,
						},
						REGISTRATION_RESULT_STATUS_DISPLAY[data.status],
						authorization
					),
				}
			} catch (error) {
				if (error.message) {
					console.error(error.message)
					return Promise.reject(error.message)
				}
			}
		},
		onLogin(handler: LoginHandler) {
			onLogin = [...onLogin, handler]
		},
		logout,
		async handleOauthToken(token: string, provider: string, mode: string, joinCommunityStatus: string) {
			await handleOauthToken(token, provider, mode, joinCommunityStatus)
		},
		getCurrentConsentPolicy: () => {
			return clonePolicyDetails(consentPolicyDetails)
		},
		_getConsentPolicyHeader: () => {
			return clonePolicyHeaderObject(consentPolicyHeaderObject)
		},
		setConsentPolicy,
		resetConsentPolicy,
		onConsentPolicyChanged: (handler: ConsentPolicyChangedHandler) => {
			consentPolicyChangedHandlers.push(handler)
		},
	}

	if (process.env.browser) {
		registerToConsentPolicyChanges((policyDetails: PolicyDetails, policyHeaderObject: PolicyHeaderObject) => {
			consentPolicyDetails = policyDetails
			consentPolicyHeaderObject = policyHeaderObject
			consentPolicyChangedHandlers.forEach((handler) => handler(clonePolicyDetails(policyDetails)))
		})

		registerToUserLogin(async () => {
			const newMemberDetails = await getMemberDetails()
			api.currentUser = new User(
				{ ...newMemberDetails, uid: newMemberDetails?.id, svSession },
				newMemberDetails ? REGISTRATION_RESULT_STATUS_DISPLAY[newMemberDetails.status] : undefined,
				authorization
			)
			onLogin.forEach((handler) => {
				try {
					handler(api.currentUser)
				} catch (e) {
					console.error(e)
				}
			})
		})
	}

	return {
		[namespace]: api,
	}
}

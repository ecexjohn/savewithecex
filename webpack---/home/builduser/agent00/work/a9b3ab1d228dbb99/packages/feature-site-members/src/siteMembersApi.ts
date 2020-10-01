import { named, withDependencies, optional } from '@wix/thunderbolt-ioc'
import {
	Fetch,
	IFetchApi,
	ILogger,
	IPropsStore,
	IStructureAPI,
	LoggerSymbol,
	Props,
	SiteFeatureConfigSymbol,
	StructureAPI,
	ViewerModel,
	ViewerModelSym,
	ILanguage,
	BrowserWindowSymbol,
	BrowserWindow,
	MasterPageFeatureConfigSymbol,
	ITranslationsFetcher,
	Translate,
	WixBiSessionSymbol,
	WixBiSession,
	BusinessLoggerSymbol,
	LanguageSymbol,
	CurrentRouteInfoSymbol,
} from '@wix/thunderbolt-symbols'
import { isSSR, parseCookieString } from '@wix/thunderbolt-commons'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import { Router, IRouter, IUrlHistoryManager, UrlHistoryManagerSymbol, ICurrentRouteInfo } from 'feature-router'
import { ISiteScrollBlocker, SiteScrollBlockerSymbol } from 'feature-site-scroll-blocker'
import { IPopups, PopupsSymbol } from 'feature-popups'
import { IReporterApi, ReporterSymbol } from 'feature-reporter'
import { uniqueId } from 'lodash'
import { INTERACTIONS /* , DIALOGS, NOTIFICATIONS */, PrivacyStatus } from './constants'
import { CommonProps, getDialogService } from './dialogService'
import { name } from './symbols'
import {
	AuthenticationToken,
	IContactInfo,
	ISiteMembersApi,
	IStatus,
	LoginOptions,
	LoginResult,
	MemberDetails,
	SiteMembersSiteConfig,
	MemberDetailsDTO,
	SiteMembersMasterPageConfig,
	ViewModeProp,
} from './types'
import { memberDetailsFromDTO, hangingPromise } from './utils'
import { BusinessLogger } from 'feature-business-logger'
import { BIEvents } from './biEvents'

const siteMembersApi = (
	siteFeatureConfig: SiteMembersSiteConfig,
	siteMembersMasterPageConfig: SiteMembersMasterPageConfig,
	fetchApi: IFetchApi,
	logger: ILogger,
	viewerModel: ViewerModel,
	sessionManager: ISessionManager,
	propsStore: IPropsStore,
	structureApi: IStructureAPI,
	language: ILanguage,
	browserWindow: BrowserWindow,
	router: IRouter,
	siteScrollBlocker: ISiteScrollBlocker,
	translationsFetcher: ITranslationsFetcher,
	urlHistoryManager: IUrlHistoryManager,
	businessLogger: BusinessLogger,
	wixBiSession: WixBiSession,
	popups: IPopups,
	reporter: IReporterApi = { trackEvent: () => 0 },
	currentRouteInfo: ICurrentRouteInfo
): ISiteMembersApi => {
	const {
		collectionExposure,
		smcollectionId,
		svSession,
		cookies,
		protectedHomepage,
		isCommunityInstalled,
		memberInfoAppId,
	} = siteFeatureConfig
	const isSiteIsWixInternal = collectionExposure === 'WixInternal'
	const metasiteAppDefinitionId = '22bef345-3c5b-4c18-b782-74d4085112ff'
	const metasiteInstance = sessionManager.getAppInstanceByAppDefId(metasiteAppDefinitionId)
	const biVisitorId = sessionManager.getVisitorId() ?? 'unknown'
	const { smSettings, tpaApplicationIds, policyLinks } = siteMembersMasterPageConfig
	const isMemberInfoPage = memberInfoAppId && tpaApplicationIds[memberInfoAppId]

	const { siteRevision, metaSiteId, siteId, externalBaseUrl } = viewerModel.site
	const requestUrl = viewerModel.requestUrl
	const viewMode = viewerModel.viewMode

	const loginUrl = '/_api/wix-sm-webapp/member/login'
	const registerUrl = '/_api/wix-sm-webapp/v1/auth/signup'
	const authenticateSessionUrl = `/_api/wix-sm-webapp/tokens/verify/${metaSiteId}/${siteId}`
	const authorizeMemberPagesUrl = `${externalBaseUrl.replace(/\/$/, '')}/api/wix-sm/v1/authorize/${siteId}/pages`
	const logoutUrl = `/_api/wix-sm-webapp/tokens/logout/${metaSiteId}`
	const sendResetPasswordEmailUrl = '/_api/wix-sm-webapp/member/sendForgotPasswordMail'
	const changePasswordUrl = `/_api/wix-sm-webapp/member/changePasswordWithMailToken?metaSiteId=${metaSiteId}&collectionId=${smcollectionId}`
	const handleOauthTokenUrl = `/_api/wix-sm-webapp/social/token/handle?metaSiteId=${metaSiteId}&collectionId=${smcollectionId}`
	const resendEmailVerificationUrl = '/_api/wix-sm-webapp/tokens/email/resend'
	const dynamicmodelUrl = `${externalBaseUrl.replace(/\/$/, '')}/_api/dynamicmodel`

	const defaultDialog = smSettings.smFirstDialogLogin ? 'login' : 'signup'
	const {
		socialLoginFacebookEnabled,
		socialLoginGoogleEnabled,
		termsOfUse,
		privacyPolicy,
		codeOfConduct,
		customSignUpPageId,
	} = smSettings
	const joinCommunityCheckedByDefault = smSettings.joinCommunityCheckedByDefault ?? true
	const parsedCookies = parseCookieString(cookies)

	let { smToken } = siteFeatureConfig
	let memberDetails = {} as MemberDetails
	let savedSessionToken = parsedCookies.smSession
	let appDidMountCallback: (() => void) | null = null
	let appMounted = false

	const registerToAppDidMount = (cb: () => void) => {
		appDidMountCallback = cb
	}

	const getDialogOptions = () => {
		const isDirectNavigation = !currentRouteInfo.getCurrentRouteInfo()
		return {
			registerToAppDidMount,
			shouldWaitForAppDidMount: !appMounted && isDirectNavigation,
		}
	}

	const onLogin: { [callbackId: string]: () => void } = {}
	const triggerOnLoginCallbacks = () => {
		return Promise.all(
			Object.values(onLogin).map(async (cb) => {
				try {
					await cb()
				} catch (e) {
					logger.captureError(e, { tags: { feature: 'site-members' } })
				}
			})
		)
	}

	const biEvents = BIEvents({
		sessionManager,
		businessLogger,
		wixBiSession,
		viewMode: viewMode?.toUpperCase() as ViewModeProp,
		language,
	})
	biEvents.siteMembersFeatureLoaded()
	const onMemberDetailsRefresh: { [callbackId: string]: () => void } = {}
	const triggerOnMemberDetailsRefreshCallbacks = () => {
		return Promise.all(
			Object.values(onMemberDetailsRefresh).map(async (cb) => {
				try {
					await cb()
				} catch (e) {
					logger.captureError(e, { tags: { feature: 'site-members' } })
				}
			})
		)
	}

	const performFetch = getPerformFetch(
		fetchApi,
		{
			credentials: 'same-origin',
			headers: {
				accept: 'application/json',
				'x-wix-site-revision': `${siteRevision}`,
			},
		},
		viewerModel.requestUrl
	)

	const dialogService = getDialogService(propsStore, structureApi, siteScrollBlocker)
	const useGoogleSdk = viewerModel.experiments['specs.thunderbolt.sm_googleAuthViaSDK']

	const api = {
		appDidMount() {
			if (appDidMountCallback) {
				appDidMountCallback()
			}
			appMounted = true
		},
		async login(email: string, password: string): Promise<LoginResult> {
			reporter.trackEvent({
				eventName: 'CustomEvent',
				params: {
					eventCategory: 'Site members',
					eventAction: 'Log in Submit',
					eventLabel: 'Wix',
				},
			})

			const result = await performFetch(loginUrl, {
				method: 'POST',
				body: `email=${email}&password=${password}&collectionId=${smcollectionId}&metaSiteId=${metaSiteId}&appUrl=${requestUrl}&svSession=${svSession}`,
			})

			const { errorCode, payload } = result
			if (errorCode) {
				reporter.trackEvent({
					eventName: 'CustomEvent',
					params: {
						eventCategory: 'Site members',
						eventAction: 'Log in Failure',
						eventLabel: 'Wix',
					},
				})
				throw errorCode
			}

			reporter.trackEvent({
				eventName: 'CustomEvent',
				params: {
					eventCategory: 'Site members',
					eventAction: 'Log in Success',
					eventLabel: 'Wix',
				},
			})

			return api.handleLoginPayload(payload)
		},
		async handleOauthToken(
			token: string,
			provider: string,
			mode: string,
			joinCommunityStatus: string
		): Promise<LoginResult> {
			const visitorId = sessionManager.getVisitorId()
			logger.interactionStarted(INTERACTIONS.SOCIAL_APP_LOGIN)
			reporter.trackEvent({
				eventName: 'CustomEvent',
				params: {
					eventCategory: 'Site members',
					eventAction: 'Log in Submit',
					eventLabel: provider,
				},
			})
			const { errorCode, payload } = await performFetch(handleOauthTokenUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					svSession,
					visitorId,
					token,
					provider,
					mode,
					lang: language.userLanguage,
					privacyStatus: joinCommunityStatus,
				}),
			})

			if (errorCode) {
				reporter.trackEvent({
					eventName: 'CustomEvent',
					params: {
						eventCategory: 'Site members',
						eventAction: 'Log in Failure',
						eventLabel: provider,
					},
				})
				throw errorCode
			}

			logger.interactionEnded(INTERACTIONS.SOCIAL_APP_LOGIN)
			reporter.trackEvent({
				eventName: 'CustomEvent',
				params: {
					eventCategory: 'Site members',
					eventAction: 'Log in Success',
					eventLabel: provider,
				},
			})

			const { sessionToken, siteMemberDto } = payload.smSession
			return api.handleLoginPayload({ sessionToken, siteMemberDto })
		},
		async handleSocialLoginResponse(
			payload: {
				smSession: {
					sessionToken: string
					siteMemberDto: MemberDetailsDTO
				}
				siteMemberDto: MemberDetailsDTO
			},
			vendor: string
		): Promise<LoginResult> {
			// Login has already fully happened on the server at this point, so it makes sense
			// to log a complete interaction without waiting for anything.
			// This "noop" interaction and event pair is still needed to maintain compatibility
			// with the other form of social login as implemented in handleOauthToken above
			logger.interactionStarted(INTERACTIONS.SOCIAL_APP_LOGIN)
			logger.interactionEnded(INTERACTIONS.SOCIAL_APP_LOGIN)
			reporter.trackEvent({
				eventName: 'CustomEvent',
				params: {
					eventCategory: 'Site members',
					eventAction: 'Log in Submit',
					eventLabel: vendor,
				},
			})
			reporter.trackEvent({
				eventName: 'CustomEvent',
				params: {
					eventCategory: 'Site members',
					eventAction: 'Log in Success',
					eventLabel: vendor,
				},
			})

			return api.handleLoginPayload(payload.smSession)
		},
		async handleLoginPayload(payload: {
			sessionToken: string
			siteMemberDto: MemberDetailsDTO
		}): Promise<LoginResult> {
			const { sessionToken, siteMemberDto } = payload

			const member = memberDetailsFromDTO(siteMemberDto)
			const emailVerified = member.emailVerified

			if (!sessionToken && !emailVerified && member.status === 'ACTIVE') {
				await api.showConfirmationEmailDialog(member.id)
				return hangingPromise()
			} else if (!sessionToken) {
				const translate = await translationsFetcher()
				await api.showNotificationDialog(
					'',
					`${translate(
						'siteMembersTranslations',
						'SMApply_Success1',
						'Success! Your member login request has been sent and is awaiting approval.'
					)} ${translate(
						'siteMembersTranslations',
						'SMApply_Success2',
						'The site administrator will notify you via email ({0}) once your request has been approved.'
					)}`.replace('{0}', member.loginEmail),
					translate('siteMembersTranslations', 'SMContainer_OK', 'OK')
				)
				return hangingPromise()
			} else {
				await api.applySessionToken(sessionToken)

				memberDetails = member

				await sessionManager.loadNewSession({ reason: 'memberLogin' })

				await triggerOnLoginCallbacks()

				return { sessionToken, member }
			}
		},
		promptLogin(loginOptions: Partial<LoginOptions> = {}, isCloseable: boolean = true): Promise<LoginResult> {
			const { mode, modal } = loginOptions
			const modeToDisplay = mode ?? defaultDialog
			const displayMode =
				modal && viewerModel.experiments['specs.thunderbolt.sm_displayLoginAsAPopup'] ? 'popup' : 'fullscreen'

			if (modeToDisplay === 'login') {
				return api.showLoginDialog(isCloseable, displayMode)
			} else {
				return api.showSignUpDialog(isCloseable, displayMode)
			}
		},
		promptForgotPassword(isCloseable: boolean = true): Promise<void> {
			return new Promise((resolve, reject) => {
				const props: CommonProps = {
					isCloseable,
				}
				const actions = {
					onCloseDialogCallback() {
						console.log('authentication canceled')
						biEvents.closingDialog('RequestResetPassword')
						dialogService.hideDialog()
						reject('authentication canceled')
					},
					onSubmitCallback(email: string) {
						return api.sendForgotPasswordMail(email).then(async () => {
							const translate = await translationsFetcher()

							api.showNotificationDialog(
								translate(
									'siteMembersTranslations',
									'siteMembersTranslations_RESET_PASSWORD_CHECKEMAIL_TITLE',
									'Please Check Your Email'
								),
								translate(
									'siteMembersTranslations',
									'siteMembersTranslations_RESET_PASSWORD_CHECKEMAIL_TEXT',
									'We’ve emailed you a link to reset your password.'
								),
								translate('siteMembersTranslations', 'Reset_Password_OK', 'Got It')
							)
							resolve()
						})
					},
				}

				dialogService.displayDialog('RequestPasswordResetDialog', props, actions)
			})
		},
		async requestAuthentication(
			loginOptions: Partial<LoginOptions> = {}
		): Promise<{
			success: boolean
			token?: AuthenticationToken
			reason: string
		}> {
			if (savedSessionToken) {
				return { success: true, token: savedSessionToken, reason: 'already logged in' }
			}

			try {
				// The dialog is not closeable if and only if the homepage is protected and login was prompted by navigation
				const isCloseable = !protectedHomepage
				const { sessionToken } = await api.promptLogin(loginOptions, isCloseable)
				return { success: true, token: sessionToken, reason: 'success' }
			} catch (reason) {
				return { success: false, reason }
			}
		},
		async applySessionToken(token: string): Promise<void> {
			logger.interactionStarted(INTERACTIONS.VERIFY_TOKEN)
			const { errorCode } = await performFetch(authenticateSessionUrl, {
				method: 'POST',
				body: `token=${token}`,
			})

			if (errorCode) {
				throw errorCode
			}
			logger.interactionEnded(INTERACTIONS.VERIFY_TOKEN)

			await sessionManager.loadNewSession({ reason: 'memberLogin' })

			smToken = await api.getSmToken()
			savedSessionToken = token
		},
		async getSmToken(): Promise<string> {
			const { clientSpecMap } = (await fetchApi.envFetch(dynamicmodelUrl).then((r) => r.json())) as {
				clientSpecMap: { [id: number]: { type: string; smtoken?: string } }
			}
			const siteMembersApp = Object.values(clientSpecMap).find((app) => app.type === 'sitemembers')
			return siteMembersApp!.smtoken!
		},
		async authorizeMemberPagesByCookie(): Promise<{ [pageId: string]: string }> {
			const options = isSSR(browserWindow)
				? {
						headers: {
							cookie: `smSession=${parsedCookies.smSession}`,
						},
				  }
				: undefined
			const { authorizedPages, errorCode } = await performFetch(authorizeMemberPagesUrl, options)

			if (errorCode) {
				throw errorCode
			}

			return authorizedPages
		},
		async authorizeMemberPagesByToken(token: string): Promise<{ [pageId: string]: string }> {
			// Due to a design flaw, we may sometime be provided with a token that's not valid
			// for this endpoint. This happens when the member is already logged in and the token
			// is the same as the one we have saved in the smSession cookie. In this case we 'cheat'
			// and delegate to authorizeMemberPagesByCookie which works fine with this token, provided
			// that it's sent via cookie.
			if (token === parsedCookies.smSession) {
				return this.authorizeMemberPagesByCookie()
			}

			const { payload, errorCode } = await performFetch(authenticateSessionUrl, {
				method: 'POST',
				body: `token=${token}`,
			})

			if (errorCode) {
				throw errorCode
			}

			const { pages } = payload

			return pages
		},
		async getMemberDetails(refreshCurrentMember: boolean = false): Promise<MemberDetails | null> {
			if (memberDetails.id && !refreshCurrentMember) {
				return memberDetails
			} else if (smToken) {
				const getMemberDetailsUrl = `/_api/wix-sm-webapp/member/${smToken}?collectionId=${smcollectionId}&metaSiteId=${metaSiteId}`
				const { payload, errorCode } = await performFetch(getMemberDetailsUrl)

				if (errorCode) {
					throw errorCode
				}

				memberDetails = memberDetailsFromDTO(payload)

				if (refreshCurrentMember) {
					await triggerOnMemberDetailsRefreshCallbacks()
				}

				return memberDetails
			}

			return null
		},
		async register(
			email: string,
			password: string,
			contactInfo?: IContactInfo,
			profilePrivacyStatus?: PrivacyStatus,
			defaultFlow?: boolean
		) {
			try {
				logger.interactionStarted(INTERACTIONS.CODE_SIGNUP)
				reporter.trackEvent({
					eventName: 'CustomEvent',
					params: {
						eventCategory: 'Site members',
						eventAction: 'Sign up Submit',
						eventLabel: 'Wix',
					},
				})

				const body = {
					email,
					password,
					profilePrivacyStatus,
					contactInfo,
					defaultFlow,
				}
				const {
					member,
					approvalToken,
					session,
				}: {
					session?: { token: string }
					member: MemberDetails
					approvalToken: string
				} = await performFetch(registerUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						authorization: metasiteInstance || '',
					},
					body: JSON.stringify(body),
				})

				const emailVerified = member.emailVerified
				const sessionToken = session?.token
				const status: IStatus = member?.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING'

				if (!sessionToken && !emailVerified && member.status === 'ACTIVE') {
					await api.showConfirmationEmailDialog(member.id)
					logger.interactionEnded(INTERACTIONS.CODE_SIGNUP)
					return { member, status }
				} else if ((defaultFlow && member?.status === 'APPLICANT') || !sessionToken) {
					const translate = await translationsFetcher()
					await api.showNotificationDialog(
						'',
						`${translate(
							'siteMembersTranslations',
							'SMApply_Success1',
							'Success! Your member login request has been sent and is awaiting approval.'
						)} ${translate(
							'siteMembersTranslations',
							'SMApply_Success2',
							'The site administrator will notify you via email ({0}) once your request has been approved.'
						)}`.replace('{0}', email),
						translate('siteMembersTranslations', 'SMContainer_OK', 'OK')
					)
					logger.interactionEnded(INTERACTIONS.CODE_SIGNUP)
					return { member, status, approvalToken }
				} else {
					await api.applySessionToken(sessionToken)

					memberDetails = member

					await triggerOnLoginCallbacks()

					logger.interactionEnded(INTERACTIONS.CODE_SIGNUP)
					reporter.trackEvent({
						eventName: 'CustomEvent',
						params: {
							eventCategory: 'Site members',
							eventAction: 'Sign up Success',
							eventLabel: 'Wix',
						},
					})
					return { member, status, sessionToken }
				}
			} catch (e) {
				reporter.trackEvent({
					eventName: 'CustomEvent',
					params: {
						eventCategory: 'Site members',
						eventAction: 'Sign up Failure',
						eventLabel: 'Wix',
					},
				})
				throw e
			}
		},
		async sendForgotPasswordMail(email: string) {
			logger.interactionStarted(INTERACTIONS.RESET_PASSWORD)
			const userLanguage = language.userLanguage
			const { errorCode } = await performFetch(sendResetPasswordEmailUrl, {
				method: 'POST',
				body: `returnUrl=${encodeURIComponent(
					requestUrl
				)}&collectionId=${smcollectionId}&metaSiteId=${metaSiteId}&lang=${userLanguage}&email=${email}`,
			})

			if (errorCode) {
				throw errorCode
			}
			logger.interactionEnded(INTERACTIONS.RESET_PASSWORD)
		},
		async changePassword(newPassword: string, token: string) {
			const { errorCode } = await performFetch(changePasswordUrl, {
				method: 'POST',
				body: `newPassword=${newPassword}&forgotPasswordToken=${token}`,
			})

			if (errorCode) {
				throw errorCode
			}
		},
		async resendEmailVerification(memberId: string) {
			const { errorCode } = await performFetch(`${resendEmailVerificationUrl}/${memberId}`)

			if (errorCode) {
				throw errorCode
			}
		},
		async logout(redirectToUrl?: string) {
			// This might only become relevant again when running inside the editor
			// if (memberDetails && memberDetails.owner) {
			// 	// eslint-disable-next-line no-throw-literal
			// 	throw 'Current member is the site owner, which can not be logout'
			// }
			await performFetch(logoutUrl, {
				method: 'POST',
			})

			if (redirectToUrl) {
				const relativeUrl = `./${redirectToUrl.replace(/^\//, '')}`

				await router.navigate(relativeUrl)
			}

			if (!isSSR(browserWindow)) {
				browserWindow.document.location.reload()
			}
		},
		registerToUserLogin(callback: () => any): string {
			const callbackId = uniqueId('callback') // This specific prefix is added to maintain compat with previous implementation
			onLogin[callbackId] = callback
			return callbackId
		},
		unRegisterToUserLogin(callbackId: string): void {
			delete onLogin[callbackId]
		},
		registerToMemberDetailsRefresh(callback: () => any): string {
			const callbackId = uniqueId('mdrcb')
			onMemberDetailsRefresh[callbackId] = callback
			return callbackId
		},
		unRegisterToMemberDetailsRefresh(callbackId: string): void {
			delete onMemberDetailsRefresh[callbackId]
		},
		async showWelcomeDialog(isCloseable: boolean = true) {
			const props: CommonProps = {
				isCloseable,
			}
			const actions = {
				onCloseDialogCallback() {
					biEvents.closingDialog('WelcomeDialog')
					const urlHostname = new URL(viewerModel.requestUrl).hostname
					const hostName = urlHostname.indexOf('www') === 0 ? urlHostname.substr(3) : urlHostname
					clearCookie('sm_ef', '/', hostName)
					dialogService.hideDialog()
				},
				onSubmitCallback() {
					const urlHostname = new URL(viewerModel.requestUrl).hostname
					const hostName = urlHostname.indexOf('www') === 0 ? urlHostname.substr(3) : urlHostname
					clearCookie('sm_ef', '/', hostName)
					dialogService.hideDialog()
					if (isMemberInfoPage) {
						// FIXME: We should navigate to memberInfoPage somehow, not to this hardcoded url
						router.navigate('./account/my-account')
					}
				},
			}

			dialogService.displayDialog('WelcomeDialog', props, actions)
		},
		async showResetPasswordDialog(token: string) {
			const props: CommonProps = {
				isCloseable: true,
			}
			const actions = {
				onCloseDialogCallback() {
					biEvents.closingDialog('ResetPasswordDialog')
					const url = urlHistoryManager.getParsedUrl()
					url.searchParams.delete('forgotPasswordToken')
					url.searchParams.delete('forgotPasswordLang')
					urlHistoryManager.pushUrlState(url)

					dialogService.hideDialog()
				},
				async onSubmitCallback(newPassword: string) {
					const translate = await translationsFetcher()

					return api.changePassword(newPassword, token).then(() => {
						api.showNotificationDialog(
							translate(
								'siteMembersTranslations',
								'siteMembersTranslations_Reset_Password_Sucess_Title',
								'Your password has been changed.'
							),
							'',
							translate('siteMembersTranslations', 'SMContainer_OK', 'OK'),
							() => {
								api.showLoginDialog()
								const url = urlHistoryManager.getParsedUrl()
								url.searchParams.delete('forgotPasswordToken')
								url.searchParams.delete('forgotPasswordLang')
								urlHistoryManager.pushUrlState(url)
							}
						)
					})
				},
			}

			dialogService.displayDialog('ResetPasswordDialog', props, actions)
		},
		async showLoginDialog(
			isCloseable: boolean = true,
			displayMode: CommonProps['displayMode'] = 'fullscreen'
		): Promise<LoginResult> {
			return new Promise(async (resolve, reject) => {
				const props = {
					displayMode,
					language: language.userLanguage,
					isCloseable,
					smCollectionId: smcollectionId,
					svSession,
					biVisitorId,
					metaSiteId,
					isSocialLoginGoogleEnabled: socialLoginGoogleEnabled,
					isSocialLoginFacebookEnabled: !isSiteIsWixInternal && socialLoginFacebookEnabled,
					isEmailLoginEnabled: !isSiteIsWixInternal,
					useGoogleSdk,
				}
				const actions = {
					onCloseDialogCallback() {
						dialogService.hideDialog()
						biEvents.closingDialog('MemberLoginDialog', displayMode)
						reject('authentication canceled')
					},
					submit(email: string, password: string) {
						logger.interactionStarted(INTERACTIONS.DEFAULT_LOGIN)
						biEvents.emailAuthSubmitClicked('MemberLoginDialog', displayMode)
						return api.login(email, password).then((loginResult) => {
							logger.interactionEnded(INTERACTIONS.DEFAULT_LOGIN)
							dialogService.hideDialog()
							resolve(loginResult)
						})
					},
					onForgetYourPasswordClick() {
						api.promptForgotPassword(isCloseable)
					},
					onSwitchDialogLinkClick() {
						api.showSignUpDialog(isCloseable, displayMode).then(resolve, reject)
					},
					onTokenMessage(token: string, vendor: string, joinCommunityChecked: boolean = false) {
						const joinCommunityStatus = joinCommunityChecked ? 'PUBLIC' : 'PRIVATE'
						return api
							.handleOauthToken(token, vendor, 'memberLoginDialog', joinCommunityStatus)
							.then((loginResult) => {
								dialogService.hideDialog()
								resolve(loginResult)
							})
					},
					onBackendSocialLogin(
						data: {
							smSession: {
								sessionToken: string
								siteMemberDto: MemberDetailsDTO
							}
							siteMemberDto: MemberDetailsDTO
						},
						vendor: string
					) {
						return api.handleSocialLoginResponse(data, vendor).then((loginResult) => {
							dialogService.hideDialog()
							resolve(loginResult)
						})
					},
				}
				dialogService.displayDialog('MemberLoginDialog', props, actions, getDialogOptions())
			})
		},
		async showSignUpDialog(
			isCloseable: boolean = true,
			displayMode: CommonProps['displayMode'] = 'fullscreen'
		): Promise<LoginResult> {
			return new Promise((resolve, reject) => {
				if (customSignUpPageId) {
					const cbid = api.registerToUserLogin(() => {
						resolve({
							member: memberDetails,
							sessionToken: savedSessionToken,
						})
						api.unRegisterToUserLogin(cbid)
					})
					dialogService.hideDialog()
					popups.openPopupPage(customSignUpPageId, () => {
						reject('authentication canceled')
						api.unRegisterToUserLogin(cbid)
					})

					return
				}

				const props = {
					displayMode,
					language: language.userLanguage,
					isCloseable,
					smCollectionId: smcollectionId,
					biVisitorId,
					svSession,
					metaSiteId,
					isSocialLoginGoogleEnabled: socialLoginGoogleEnabled,
					isSocialLoginFacebookEnabled: !isSiteIsWixInternal && socialLoginFacebookEnabled,
					isEmailLoginEnabled: !isSiteIsWixInternal,
					isCommunityInstalled,
					joinCommunityCheckedByDefault,
					isTermsOfUseNeeded: !!(termsOfUse?.enabled && policyLinks.termsOfUse),
					isPrivacyPolicyNeeded: !!(privacyPolicy?.enabled && policyLinks.privacyPolicy),
					isCodeOfConductNeeded: !!(codeOfConduct?.enabled && policyLinks.codeOfConduct),

					termsOfUseLink: policyLinks.termsOfUse,
					privacyPolicyLink: policyLinks.privacyPolicy,
					codeOfConductLink: policyLinks.codeOfConduct,
					useGoogleSdk,
				}
				const actions = {
					onCloseDialogCallback() {
						dialogService.hideDialog()
						biEvents.closingDialog('SignUpDialog', displayMode)
						reject('authentication canceled')
					},
					submit(email: string, password: string, isCommunityChecked: boolean) {
						logger.interactionStarted(INTERACTIONS.DEFAULT_SIGNUP)
						biEvents.emailAuthSubmitClicked('SignUpDialog', displayMode)
						const profilePrivacyStatus = isCommunityChecked ? PrivacyStatus.PUBLIC : PrivacyStatus.PRIVATE
						return api.register(email, password, undefined, profilePrivacyStatus).then((registerResult) => {
							logger.interactionEnded(INTERACTIONS.DEFAULT_SIGNUP)
							const { member, sessionToken } = registerResult
							if (sessionToken) {
								dialogService.hideDialog()
								resolve({ member, sessionToken })
							}
						})
					},
					onSwitchDialogLinkClick() {
						api.showLoginDialog(isCloseable, displayMode).then(resolve, reject)
					},
					onTokenMessage(token: string, vendor: string, joinCommunityChecked: boolean = false) {
						const joinCommunityStatus = joinCommunityChecked ? 'PUBLIC' : 'PRIVATE'
						return api
							.handleOauthToken(token, vendor, 'memberLoginDialog', joinCommunityStatus)
							.then((loginResult) => {
								dialogService.hideDialog()
								resolve(loginResult)
							})
					},
					onBackendSocialLogin(
						data: {
							smSession: {
								sessionToken: string
								siteMemberDto: MemberDetailsDTO
							}
							siteMemberDto: MemberDetailsDTO
						},
						vendor: string
					) {
						return api.handleSocialLoginResponse(data, vendor).then((loginResult) => {
							dialogService.hideDialog()
							resolve(loginResult)
						})
					},
				}

				dialogService.displayDialog('SignUpDialog', props, actions, getDialogOptions())
			})
		},
		async showNotificationDialog(
			title: string,
			description: string,
			okButtonText: string,
			onOkButtonClick: () => void = () => 0,
			onCloseDialogCallback: () => void = () => 0
		) {
			const props = {
				isCloseable: true,
				title,
				description,
				okButtonText,
			}
			const actions = {
				onCloseDialogCallback() {
					biEvents.closingDialog('NotificationDialog')
					dialogService.hideDialog()
					onCloseDialogCallback()
				},
				onOkButtonClick() {
					dialogService.hideDialog()
					onOkButtonClick()
				},
			}

			await dialogService.displayDialog('NotificationDialog', props, actions)
		},
		async showConfirmationEmailDialog(memberId: string, isSignUp = true) {
			const props = {
				isCloseable: true,
				isSignUp,
			}
			const actions = {
				onCloseDialogCallback() {
					biEvents.closingDialog('ConfirmationEmailDialog')
					dialogService.hideDialog()
				},
				async onResendConfirmationEmail() {
					await api.resendEmailVerification(memberId)
					await api.showConfirmationEmailDialog(memberId, false)
				},
			}

			await dialogService.displayDialog('ConfirmationEmailDialog', props, actions)
		},
		appWillMount() {
			const url = new URL(viewerModel.requestUrl)

			const forgotPasswordToken = url.searchParams.get('forgotPasswordToken')

			// TODO: take care of the all the dialogs and behaviours that are triggered by
			// url, cookies, etc.
			if (forgotPasswordToken) {
				api.showResetPasswordDialog(forgotPasswordToken)
			} else if (parsedCookies.sm_ef && isMemberInfoPage) {
				api.showWelcomeDialog()
			} else {
				// Enable forcing dialogs for testing and debugging purposes
				switch (url.searchParams.get('showDialog')) {
					case 'MemberLoginDialog':
						api.showLoginDialog()
						break
					case 'SignUpDialog':
						api.showSignUpDialog()
						break
					case 'RequestPasswordResetDialog':
						api.promptForgotPassword()
						break
					case 'ResetPasswordDialog':
						api.showResetPasswordDialog('faketoken')
						break
					case 'WelcomeDialog':
						api.showWelcomeDialog()
						break
					case 'NotificationDialog':
						api.showNotificationDialog('title', 'description', 'ok')
						break
					case 'ConfirmationEmailDialog':
						api.showConfirmationEmailDialog('fakemember')
						break
					default:
						break
				}
			}
		},
		pageWillUnmount({ pageId }: { pageId: string }) {
			// We usually hide our dialogs on navigation. This lets us get out of the way in case
			// the visitor backs out of a protected page, navigates from the sign up dialog
			// to one of the policy pages, etc.
			// However, if we're using any custom forms, we mustn't treat their closure as a navigation
			// event, even though TB lifecycle does. This may lead to dialogs we intentionally opened
			// (eg. email approval dialog at the end of registration) being unintentionally closed.
			if (![customSignUpPageId /* , customLoginPageId*/].includes(pageId)) {
				dialogService.hideDialog()
			}
		},
	}

	return api
}

const getPerformFetch = (fetchApi: IFetchApi, requestInit: RequestInit, baseUrl: string) => (
	url: string,
	options: Partial<RequestInit> = {}
) => {
	const headers = {
		...requestInit.headers,
		...(options.body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
		...options.headers,
	}
	const optionsWithMergedHeaders = {
		...options,
		...{ headers },
	}

	// TODO: move this transformation into FetchApi
	const absoluteUrl = new URL(url, baseUrl).href

	return fetchApi
		.envFetch(absoluteUrl, { ...requestInit, ...optionsWithMergedHeaders })
		.then(async (response: Response) => {
			const data = await response.json()
			if (!response.ok) {
				// since we can't pass Response object between workers we better transform it now
				throw data
			}
			return data
		})
}

const clearCookie = (cookieName: string, path: string, domain: string) => {
	document.cookie = `${cookieName}=;max-age=0`
	document.cookie = `${cookieName}=;max-age=0;path=${path}`
	document.cookie = `${cookieName}=;domain=${domain};max-age=0`
	document.cookie = `${cookieName}=;domain=${domain};max-age=0;path=${path}`
}

export const SiteMembersApi = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		Fetch,
		LoggerSymbol,
		ViewerModelSym,
		SessionManagerSymbol,
		Props,
		StructureAPI,
		LanguageSymbol,
		BrowserWindowSymbol,
		Router,
		SiteScrollBlockerSymbol,
		Translate,
		UrlHistoryManagerSymbol,
		BusinessLoggerSymbol,
		WixBiSessionSymbol,
		optional(PopupsSymbol),
		optional(ReporterSymbol),
		CurrentRouteInfoSymbol,
	],
	siteMembersApi
)

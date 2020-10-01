import { User } from './user/user'
import { ISiteMembersApi, MemberDetails, IStatus, LoginOptions, PrivacyStatus } from 'feature-site-members'
import { ConsentPolicy, PolicyDetails, PolicyHeaderObject } from '@wix/cookie-consent-policy-client'

export type ConsentPolicyChangedHandler = (policyDetails: PolicyDetails) => void

export type ConsentPolicyInternalUpdatesListener = (
	policyDetails: PolicyDetails,
	policyHeaderObject: PolicyHeaderObject
) => void

export interface SiteMembersWixCodeSdkWixCodeApi {
	currentUser: User
	login(email: string, password: string): Promise<void>
	applySessionToken(sessionToken: string): Promise<void>
	emailUser(emailId: string, toUser: string, options?: TriggeredEmailOptions): Promise<void>
	promptForgotPassword(language?: string): Promise<void>
	promptLogin(options: LoginOptions): Promise<MemberDTO>
	register(email: string, password: string, options?: RegistrationOptions): Promise<RegistrationResult | void>
	onLogin(handler: LoginHandler): void
	logout(): void
	handleOauthToken(token: string, provider: string, mode: string, joinCommunityStatus: string): Promise<void>
	getCurrentConsentPolicy(): PolicyDetails
	_getConsentPolicyHeader(): PolicyHeaderObject
	setConsentPolicy(policy: ConsentPolicy): Promise<PolicyDetails>
	resetConsentPolicy(): Promise<void>
	onConsentPolicyChanged(handler: ConsentPolicyChangedHandler): void
}

/**
 * Feature factory data is derived from the feature site config as well as from environment variables
 */
export interface SiteMembersWixCodeSdkFactoryData {
	svSession: string
	authorization?: string
	consentPolicyDetails: PolicyDetails
	consentPolicyHeaderObject: PolicyHeaderObject
}

export interface SiteMembersWixCodeSdkHandlers extends Record<string, Function> {
	login: ISiteMembersApi['login']
	applySessionToken(sessionToken: string): Promise<void>
	emailUser(emailId: string, toUser: string, options?: TriggeredEmailOptions): Promise<void>
	promptForgotPassword(language?: string): Promise<void>
	promptLogin(options: LoginOptions): Promise<MemberDTO>
	register(
		email: string,
		password: string,
		options: RegistrationOptions
	): Promise<{
		status: IStatus
		approvalToken?: string
		user: MemberDetails
	}>
	registerToUserLogin(handler: () => any): void
	logout(): void
	getMemberDetails: ISiteMembersApi['getMemberDetails']
	handleOauthToken: ISiteMembersApi['handleOauthToken']
	registerToConsentPolicyChanges(listener: ConsentPolicyInternalUpdatesListener): void
	setConsentPolicy(policy: ConsentPolicy): Promise<PolicyDetails>
	resetConsentPolicy(): Promise<void>
}

type RegistrationOptions = {
	contactInfo?: IContactInfo
	privacyStatus?: PrivacyStatus
}

export type IContactInfo = {
	firstName?: string
	lastName?: string
	picture?: string
	emails?: Array<string>
	loginEmail?: string
	phones?: Array<string>
	labels?: Array<string>
	language?: string
	customFields: Array<any>
}

type TriggeredEmailOptions = {
	variables: Record<string, any>
}

export type RegistrationResult = {
	status: IStatus
	approvalToken?: string
	user: User
}

export type LoginHandler = (user: User) => void

export interface MemberDTO {
	addresses: Array<Address | string>
	contactId?: string
	creationDate?: string
	customFields: Array<any>
	emailVerified: boolean
	emails: Array<string>
	firstName?: string
	groups: Array<Group>
	id: string
	imageUrl?: string
	labels: Array<string>
	language?: string
	lastLoginDate?: string
	lastName?: string
	lastUpdateDate?: string
	loginEmail?: string
	memberName?: string
	nickname?: string
	phones: Array<string>
	picture?: Image
	profilePrivacyStatus: V1SiteMemberPrivacyStatus
	role: Role
	slug?: string
	status: V1SiteMemberStatus
	userId?: string
}

export interface Address {
	city?: string
	country?: string
	postalCode?: string
	region?: string
	street?: string
}

interface V3CustomField {
	dateValue?: string
	name?: string
	numValue?: number
	strValue?: string
}

interface Group {
	id: string
	name: string
	type: string
}

interface Image {
	height: number
	id: string
	url: string
	width: number
}

export enum V1SiteMemberPrivacyStatus {
	PRIVATE = 'PRIVATE',
	COMMUNITY = 'COMMUNITY',
	UNDEFINED = 'UNDEFINED',
	PUBLIC = 'PUBLIC',
}

export enum Role {
	OWNER = 'OWNER',
	CONTRIBUTOR = 'CONTRIBUTOR',
	MEMBER = 'MEMBER',
	UNDEFINED_ROLE = 'UNDEFINED_ROLE',
}

export enum V1SiteMemberStatus {
	APPLICANT = 'APPLICANT',
	BLOCKED = 'BLOCKED',
	UNDEFINED_STATUS = 'UNDEFINED_STATUS',
	OFFLINE_ONLY = 'OFFLINE_ONLY',
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export enum REGISTRATION_RESULT_STATUS_DISPLAY {
	ACTIVE = 'Active',
	PENDING = 'Pending',
	APPLICANT = 'Applicant',
}

export enum UserRoles {
	VISITOR = 'Visitor',
	MEMBER = 'Member',
	ADMIN = 'Admin',
}

export enum UserErrors {
	NO_INSTANCE_FOUND = 'wix code is not enabled',
	CLOSE_DIALOG = 'The user closed the login dialog',
	NO_LOGGED_IN = 'No user is currently logged in',
	NOT_ALLOWED_IN_PREVIEW = 'Action not allowed in preview mode',
	AWAITING_APPROVAL = 'Member login request has been sent and is awaiting approval',
}

export enum AppDefIds {
	wixCode = '675bbcef-18d8-41f5-800e-131ec9e08762',
	shoutOut = '135c3d92-0fea-1f9d-2ba5-2a1dfb04297e',
}

export type IGetMemberDetails = ISiteMembersApi['getMemberDetails']

/**
 * Site feature config is calculated in SSR when creating the `viewerModel`
 * The config is available to your feature by injecting `named(PageFeatureConfigSymbol, name)`
 */
export type SiteMembersWixCodeSdkSiteConfig = {
	svSession: string
	smToken: string
	smcollectionId: string
}

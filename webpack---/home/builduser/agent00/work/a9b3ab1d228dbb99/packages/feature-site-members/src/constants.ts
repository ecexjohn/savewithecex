export const INTERACTIONS = {
	SOCIAL_APP_LOGIN: 'members-social-app-login',
	DEFAULT_LOGIN: 'members-default-login',
	CODE_LOGIN: 'members-code-login',
	CODE_SIGNUP: 'members-code-signup',
	DEFAULT_SIGNUP: 'members-default-signup',
	RESET_PASSWORD: 'members-reset-password',
	VERIFY_TOKEN: 'apply-session-token',
}

export const DIALOGS = {
	Login: 'login',
	SignUp: 'register',
	ResetPasswordEmail: 'resetPasswordEmail',
	ResetPasswordNewPassword: 'resetPasswordNewPassword',
	Notification: 'notification',
	Credits: 'credits',
	PasswordProtected: 'enterPassword',
	EmailVerification: 'emailVerification',
	SentConfirmationEmail: 'sentConfirmationEmail',
	Welcome: 'welcome',
	NoPermissionsToPage: 'noPermissionsToPage',
}

export const NOTIFICATIONS = {
	Template: 'template',
	SiteOwner: 'siteowner',
	SignUp: 'register',
	ResetPasswordEmail: 'resetPasswordEmail',
	ResetPasswordNewPassword: 'resetPasswordNewPassword',
}

export enum PrivacyStatus {
	PUBLIC = 'PUBLIC',
	PRIVATE = 'PRIVATE',
	COMMUNITY = 'COMMUNITY',
}

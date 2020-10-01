import { namespace, CrmWixCodeSdkWixCodeApi } from '..'
import { PlatformUtils, PlatformEnvData } from '@wix/thunderbolt-symbols'
import { AppDefIds, CREATE_CONTACT_URL, EMAIL_CONTACT_URL } from './common/config'
import { ContactInfo } from '../types'
import { validateEmailContactParams, validateContactInfo } from './common/validations'
import { post } from './common/api'
import { createFedopsLogger } from './common/fedops'

/**
 * This is SDK Factory.
 * Expose your Corvid API
 */
export function CrmSdkFactory(
	_: any,
	__: any,
	{ sessionServiceApi, biUtils }: PlatformUtils,
	{ bi: biData }: PlatformEnvData
): { [namespace]: CrmWixCodeSdkWixCodeApi } {
	const fedopsLogger = createFedopsLogger(biUtils, biData)
	return {
		[namespace]: {
			async createContact(contactInfo: ContactInfo): Promise<any> {
				fedopsLogger.interactionStarted('create-contact')
				if (!validateContactInfo(contactInfo)) {
					return
				}
				try {
					const { contact } = await post({
						url: CREATE_CONTACT_URL,
						instanceId: sessionServiceApi.getInstance(AppDefIds.wixCode),
						body: { contact: contactInfo },
					})
					return contact.id
				} catch (message) {
					return message
				} finally {
					fedopsLogger.interactionEnded('create-contact')
				}
			},
			async emailContact(emailId, toContact, options) {
				fedopsLogger.interactionStarted('email-contact')
				const { valid, processedOptions } = validateEmailContactParams(emailId, toContact, options)
				if (!valid) {
					return 'error'
				}
				const body = { emailId, contactId: toContact, options: processedOptions }
				try {
					return post({
						url: EMAIL_CONTACT_URL,
						instanceId: sessionServiceApi.getInstance(AppDefIds.shoutOut),
						body,
					})
				} catch (message) {
					return message
				} finally {
					fedopsLogger.interactionEnded('email-contact')
				}
			},
		},
	}
}

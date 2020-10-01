import _ from 'lodash'
import { logSdkError } from '@wix/thunderbolt-commons'
import { ContactInfo } from '../../types'

const TYPES = {
	NUMBER: 'number',
	STRING: 'string',
	STRING_ARRAY: 'string array',
	BOOLEAN: 'boolean',
	OBJECT: 'object',
	UUID: 'uuid',
}
const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const validateEmailContactParams = (emailId: any, contactTo: any, options?: any) => {
	const typeRules = [
		{ acceptNil: false, propertyName: 'emailId', value: emailId, expectedType: 'string' },
		{ acceptNil: false, propertyName: 'contactTo', value: contactTo, expectedType: 'uuid' },
		{ acceptNil: true, propertyName: 'options', value: options, expectedType: 'object' },
	]
	const errorSuffix = 'For more information visit https://www.wix.com/corvid/reference/wix-crm/emailcontact'
	let valid = validate(typeRules, errorSuffix)

	let processedOptions
	if (valid && options) {
		processedOptions = _.cloneDeep(options)
		const { variables } = options
		if (variables.constructor !== Object) {
			valid = false
			logSdkError('"variables" in options parameter must be an object.')
		}

		if (valid && variables) {
			for (const key in variables) {
				if (!Object.prototype.hasOwnProperty.call(variables, key)) {
					continue
				}
				const value = options.variables[key]
				if (typeof value === 'boolean' || typeof value === 'number') {
					processedOptions.variables[key] = value.toString()
				} else if (typeof value !== 'string' && !(value instanceof String)) {
					valid = false
					logSdkError(
						`variable "${key}" value must be string. For more information visit https://www.wix.com/corvid/reference/wix-crm/emailcontact`
					)
				}
			}
		}
	}
	return {
		valid,
		processedOptions: valid && processedOptions,
	}
}

export function validateContactInfo(contactInfo: ContactInfo) {
	const { emails, phones, firstName, language, labels, lastName, emaillogin, picture } = contactInfo
	const typeRules = [
		{ acceptNil: true, propertyName: 'email', value: emails, expectedType: 'string array' },
		{ acceptNil: true, propertyName: 'phone', value: phones, expectedType: 'string array' },
		{ acceptNil: true, propertyName: 'label', value: labels, expectedType: 'string array' },
		{ acceptNil: true, propertyName: 'firstName', value: firstName, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'lastName', value: lastName, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'lastName', value: language, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'emaillogin', value: emaillogin, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'picture', value: picture, expectedType: 'string' },
	]
	return validate(typeRules)
}

const validate = (typeRules, errorSuffix = '') => {
	let valid = true
	typeRules.forEach(({ propertyName, value, expectedType, acceptNil }) => {
		if (!validateByType({ value, expectedType, acceptNil })) {
			valid = false
			logSdkError(typeError(propertyName, expectedType, errorSuffix))
		}
	})
	return valid
}

function validateByType({ value, expectedType, acceptNil }) {
	if (_.isNil(value) && acceptNil) {
		return true
	}
	switch (expectedType) {
		case TYPES.NUMBER:
			return _.isNumber(value) && !_.isNaN(value)
		case TYPES.STRING:
			return _.isString(value)
		case TYPES.STRING_ARRAY:
			return _.isArray(value) && _.every(value, (val) => _.isString(val))
		case TYPES.BOOLEAN:
			return _.isBoolean(value)
		case TYPES.OBJECT:
			return _.isObject(value) && !_.isArray(value) && !_.isFunction(value)
		case TYPES.UUID:
			return uuidV4Regex.test(value)

		default:
			return true
	}
}

export const typeError = (propertyName, expectedType, errorSuffix) =>
	`variable "${propertyName}" value must be ${expectedType}. ${errorSuffix}`

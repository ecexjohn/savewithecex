import { namespace, PaymentsWixCodeSdkWixCodeApi } from '..'
import { getOpenModalConfig } from './openModalConfig'
import { validate } from '../validations'
import { getPaymentResults } from './getPaymentResult'
import { createBiLogger } from './bi'
import { createFedopsLogger } from './fedops'
import { PaymentOptions } from '../types'
import { PlatformUtils, PlatformEnvData } from '@wix/thunderbolt-symbols'
import { currencies } from '../currencies/currencies'

const consoleErrorPrefix = 'WixPay.startPayment: '
const cashierAppDefinitionId = '14bca956-e09f-f4d6-14d7-466cb3f09103'

export function PaymentsSdkFactory(
	_: any,
	__: any,
	{ biUtils, sessionServiceApi, wixCodeNamespacesRegistry }: PlatformUtils,
	{ bi: biData }: PlatformEnvData
): { [namespace]: PaymentsWixCodeSdkWixCodeApi } {
	return {
		[namespace]: {
			startPayment(paymentId: string, opts: PaymentOptions) {
				const instance = sessionServiceApi.getInstance(cashierAppDefinitionId)
				const startTime = Date.now()
				const options = {
					showThankYouPage: true,
					skipUserInfoPage: false,
					...opts,
				}
				const biLogger = createBiLogger({
					biUtils,
					biData,
					instance,
					options,
					paymentId,
				})
				const fedopsLogger = createFedopsLogger(biUtils, biData)

				fedopsLogger.logALE()
				biLogger.logOpenModal()

				if (options.userInfo) {
					console.warn(
						`${consoleErrorPrefix}userInfo is deprecated. Pass user information to createPayment instead.`
					)
				}

				return new Promise((resolve, reject) => {
					const config = getOpenModalConfig(paymentId, instance, options, {
						startTime,
					})
					if (
						!validate({
							paymentId,
							options,
						})
					) {
						return reject(`${consoleErrorPrefix}invalid arguments`)
					}

					wixCodeNamespacesRegistry
						.get('window')
						.openModal(config.url, config.options)
						.then(() => resolve(getPaymentResults(paymentId)))
						.catch((e) => {
							biLogger.logOpenModalCompleteFailure(e, startTime)
							throw e
						})

					biLogger.logOpenModalCompleteSuccess(startTime)
				})
			},
			currencies,
		},
	}
}

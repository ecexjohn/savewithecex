import { cashierServiceUrl } from './openModalConfig'

export const getPaymentResults = (paymentId: string) => {
	return fetch(`${cashierServiceUrl}/_api/paymentResults/${paymentId}`)
		.then((res) => res.json())
		.catch(() => {
			return {
				payment: {
					id: paymentId,
				},
				status: 'Undefined',
				transactionId: null,
			}
		})
}

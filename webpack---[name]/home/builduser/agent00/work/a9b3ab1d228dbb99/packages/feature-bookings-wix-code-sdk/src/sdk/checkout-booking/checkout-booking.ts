import { createBooking } from './dao/create-booking.dao'
import { payWithWixPay } from './dao/wix-pay.dao'
import { CreateBookingStatus } from './checkout-booking.consts'
import { getServiceById } from '../common/dao/get-service.dao'
import { validateCheckoutBooking } from './validate-checkout-booking-input'
import {
	mapCheckoutBookingToCreateBookingDTO,
	mapCreateBookingDTOToCheckoutBookingWithoutPayment,
	mapCreateBookingDTOToCheckoutBookingWithPayment,
} from './checkout-booking.mapper'
import { BookingInfo, CheckoutBookingResponse } from './checkout-booking.types'

export async function checkoutBooking(
	bookingInfo: BookingInfo,
	paymentOptions: PaymentOptions
): Promise<CheckoutBookingResponse> {
	const serviceId = bookingInfo.slot.serviceId
	const service = await getServiceById(serviceId)
	validateCheckoutBooking(service, bookingInfo.numberOfSpots, bookingInfo.formFields)
	const createBookingRequest = mapCheckoutBookingToCreateBookingDTO(bookingInfo, paymentOptions, service.form)
	const createBookingResponse = await createBooking(createBookingRequest)
	return handleCreateBookingResponse(createBookingResponse)
}

function handleCreateBookingResponse(createBookingResponse) {
	return shouldStartWixPayment(createBookingResponse.status)
		? startWixPayment(createBookingResponse)
		: mapCreateBookingDTOToCheckoutBookingWithoutPayment(createBookingResponse)
}

function shouldStartWixPayment(bookingStatus) {
	return bookingStatus === CreateBookingStatus.PENDING_WIX_PAY_APPROVAL
}

function startWixPayment(createBookingResponse) {
	return payWithWixPay(createBookingResponse.wixPayPaymentId).then((paymentResult) =>
		mapCreateBookingDTOToCheckoutBookingWithPayment(createBookingResponse, paymentResult)
	)
}

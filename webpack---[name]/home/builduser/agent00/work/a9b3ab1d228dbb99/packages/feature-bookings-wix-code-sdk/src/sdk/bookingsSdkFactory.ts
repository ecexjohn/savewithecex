import { namespace, BookingsWixCodeSdkWixCodeApi } from '..'
import { checkoutBooking } from './checkout-booking/checkout-booking'
import { getCheckoutOptions } from './checkout-options/checkout-options'
import { getServiceAvailability } from './service-availability/service-availability'

/**
 * This is SDK Factory.
 * Expose your Corvid API
 */
export function BookingsSdkFactory(): { [namespace]: BookingsWixCodeSdkWixCodeApi } {
	return {
		[namespace]: {
			getServiceAvailability,
			getCheckoutOptions,
			checkoutBooking,
		},
	}
}

import { AnimationsSdkFactory } from 'feature-animations-wix-code-sdk/factory'
import { CrmSdkFactory } from 'feature-crm-wix-code-sdk/factory'
import { RealtimeSdkFactory } from 'feature-realtime-wix-code-sdk/factory'
import { BookingsSdkFactory } from 'feature-bookings-wix-code-sdk/factory'
import { FedopsSdkFactory } from 'feature-fedops-wix-code-sdk/factory'
import { SearchSdkFactory } from 'feature-search-wix-code-sdk/factory'
import { WixStoresSdkFactory } from 'feature-stores-wix-code-sdk/factory'
import { WixEventsSdkFactory } from 'feature-events-wix-code-sdk/factory'
import { PaidPlansSdkFactory } from 'feature-paid-plans-wix-code-sdk/factory'
import { PaymentsSdkFactory } from 'feature-payments-wix-code-sdk/factory'
import { SeoSdkFactory } from 'feature-seo-wix-code-sdk/factory'
import { SiteSdkFactory } from 'feature-site-wix-code-sdk/factory'
import { WindowSdkFactory } from 'feature-window-wix-code-sdk/factory'
import { LocationSdkFactory } from 'feature-location-wix-code-sdk/factory'
import { SiteMembersSdkFactory } from 'feature-site-members-wix-code-sdk/factory'

export const wixCodeSdkFactories: Record<string, () => Promise<Function>> = {
	windowWixCodeSdk: () => Promise.resolve(WindowSdkFactory),
	siteWixCodeSdk: () => Promise.resolve(SiteSdkFactory),
	siteMembersWixCodeSdk: () => Promise.resolve(SiteMembersSdkFactory),
	locationWixCodeSdk: () => Promise.resolve(LocationSdkFactory),
	seoWixCodeSdk: () => Promise.resolve(SeoSdkFactory),
	paymentsWixCodeSdk: () => Promise.resolve(PaymentsSdkFactory),
	paidPlansWixCodeSdk: () => Promise.resolve(PaidPlansSdkFactory),
	wixEventsWixCodeSdk: () => Promise.resolve(WixEventsSdkFactory),
	searchWixCodeSdk: () => Promise.resolve(SearchSdkFactory),
	bookingsWixCodeSdk: () => Promise.resolve(BookingsSdkFactory),
	fedopsWixCodeSdk: () => Promise.resolve(FedopsSdkFactory),
	storesWixCodeSdk: () => Promise.resolve(WixStoresSdkFactory),
	realtimeWixCodeSdk: () => Promise.resolve(RealtimeSdkFactory),
	crmWixCodeSdk: () => Promise.resolve(CrmSdkFactory),
	animationsWixCodeSdk: () => Promise.resolve(AnimationsSdkFactory)
}

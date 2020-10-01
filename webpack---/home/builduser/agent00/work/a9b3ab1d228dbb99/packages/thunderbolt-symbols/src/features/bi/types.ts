import { Hub } from '@sentry/types'
import { PhasesConfig } from '@wix/fedops-logger'
import { RendererTypeCode } from '@wix/thunderbolt-ssr-api'
import { FetchFn, ViewerModel } from '../../types'
import { Factory } from '@wix/web-bi-logger/dist/src/logger' // eslint-disable-line no-restricted-syntax

export type NumericBoolean = 0 | 1 | -999 // -999 is a placeholder for not-supported data

export enum BeatEventType {
	START = 1,
	VISIBLE = 2,
	VIEWER_FINISH = 3,
	PAGE_FINISH = 33,
	FIRST_CDN_RESPONSE = 4,
	TBD = -1,
	PAGE_NAVIGATION = 101,
	PAGE_NAVIGATION_DONE = 103,
}

export enum InternalNavigationType { // this param is sent with navigation-end beat (103)
	NAVIGATION = 1, // successful navigation
	DYNAMIC_REDIRECT = 2, // redirect finished
	INNER_ROUTE = 3, // inner route finish
	NAVIGATION_ERROR = 4, // for protected page | dynamic route errors
}

export const NavigationLoggerStringMap = {
	// map between InternalNavigationType to fed ops logger string
	1: 'page-navigation', // successful navigation
	2: 'page-navigation-redirect', // redirect finished
	3: 'page-navigation-inner-route', // inner route finish
	4: 'navigation-error', // for protected page | dynamic route errors
}

export type ReportBI = (eventName: string, eventPhase?: string) => void
export type SendBeat = (
	eventType: BeatEventType,
	eventName: string,
	options?: { pageId?: string; pageNumber?: number; navigationType?: InternalNavigationType }
) => void

export type ReportPageNavigation = (pageId: string | undefined) => void

export type ReportPageNavigationDone = (pageId: string | undefined, navigationType: InternalNavigationType) => void

type WixBiSessionBase = {
	initialTimestamp: number
	initialRequestTimestamp: number
	requestId: string
	viewerSessionId: string
	sessionId: string
	msId: string
	is_rollout: RendererTypeCode
	is_platform_loaded: NumericBoolean
	suppressbi: boolean
	dc: string
	requestUrl: string
	siteRevision: string
	siteCacheRevision: string
	checkVisibility: () => boolean
	isMesh: NumericBoolean
	isServerSide: NumericBoolean
	st: 0 | 1 | 2 | 3
	isjp: boolean
	commonConfig: ViewerModel['commonConfig']
}

export type CookieAnalysis = { isCached: boolean; caching: string; microPop?: string }

export type WixBiSession = WixBiSessionBase & CookieAnalysis

export type BiStore = {
	msid: WixBiSession['msId']
	initialTimestamp: WixBiSession['initialTimestamp']
	initialRequestTimestamp: WixBiSession['initialRequestTimestamp']
	visitorId?: string
	siteMemberId?: string
	viewerSessionId: WixBiSession['viewerSessionId']
	requestId: WixBiSession['requestId']
	dc: WixBiSession['dc']
	is_rollout: WixBiSession['is_rollout']
	isCached: WixBiSession['isCached'] // TODO @Shahaf what's going on with all this snake case vs. camel case?
	is_headless: boolean
	viewerVersion: string
	rolloutData: ViewerModel['rollout']
	pageData: { pageNumber: number; pageId: string; pageUrl: string; isLightbox: boolean }
}

export type FedopsStore = {
	msid: string
	sessionId: string
	viewerSessionId: string
	requestId: string
	dc: string
	is_rollout: boolean | null
	is_dac_rollout?: number
	is_sav_rollout?: number
	isCached: boolean | null
	is_headless: boolean
	siteMemberId?: string
}

export type FedopsConfig = {
	biLoggerFactory: Factory
	customParams?: { [paramName: string]: string | boolean }
	phasesConfig?: PhasesConfig
	presetType?: string
	appName?: string
	reportBlackbox?: boolean
}

export type LoggerIntegrations = {
	sentry: Hub
	wixBiSession: WixBiSession
	viewerModel: ViewerModel
	fetch: FetchFn
}

export type MuteFunc = () => boolean
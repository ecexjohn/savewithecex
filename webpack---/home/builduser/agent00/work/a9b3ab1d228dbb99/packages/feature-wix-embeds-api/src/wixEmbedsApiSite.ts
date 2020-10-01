import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	IAppWillMountHandler,
	BrowserWindow,
	BrowserWindowSymbol,
	ViewerModelSym,
	ViewerModel,
	ILanguage,
	FeatureStateSymbol,
	LanguageSymbol,
} from '@wix/thunderbolt-symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { SessionManagerSymbol, ISessionManager } from 'feature-session-manager'
import { WixEmbedsAPI, WixEmbedsAPIFeatureState } from './types'
import { name } from './symbols'

const wixEmbedsApiSiteFactory = (
	featureState: IFeatureState<WixEmbedsAPIFeatureState>,
	sessionManager: ISessionManager,
	window: BrowserWindow,
	viewerModel: ViewerModel,
	language: ILanguage
): IAppWillMountHandler => {
	return {
		async appWillMount() {
			const state: WixEmbedsAPIFeatureState = { listeners: {}, firstMount: true }
			featureState.update(() => state)

			const callbacksFor = (eventName: string) => state.listeners[eventName] || []

			const { site } = viewerModel
			const api: WixEmbedsAPI = {
				getMetaSiteId: () => site.metaSiteId,
				getHtmlSiteId: () => site.siteId,
				getExternalBaseUrl: () => site.externalBaseUrl,
				isWixSite: () => site.siteType === 'WixSite',
				getLanguage: () => language.siteLanguage,

				getAppToken: (appDefId) => sessionManager.getAppInstanceByAppDefId(appDefId),

				registerToEvent(eventName, callback) {
					state.listeners[eventName] = callbacksFor(eventName)
					state.listeners[eventName].push(callback)
				},
				unregisterFromEvent(eventName, callback) {
					state.listeners[eventName] = [...callbacksFor(eventName)].filter((func) => func !== callback)
				},
			}
			window!.wixEmbedsAPI = api
			const event = window!.document.createEvent('Event')
			event.initEvent('wixEmbedsAPIReady', true, false)
			window!.dispatchEvent(event)
		},
	}
}

export const WixEmbedsApiSite = withDependencies(
	[named(FeatureStateSymbol, name), SessionManagerSymbol, BrowserWindowSymbol, ViewerModelSym, LanguageSymbol],
	wixEmbedsApiSiteFactory
)

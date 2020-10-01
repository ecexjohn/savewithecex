import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	CurrentRouteInfoSymbol,
	IPropsStore,
	ISamePageUrlChangeListener,
	IStructureAPI,
	pageIdSym,
	Props,
	StructureAPI,
} from '@wix/thunderbolt-symbols'
import { ICurrentRouteInfo } from 'feature-router'
import { ITpaSrcBuilder, TpaSrcBuilderSymbol } from 'feature-tpa-commons'
import { ITpa, ITPAEventsListenerManager, ITpaPopup } from './types'
import { TpaEventsListenerManagerSymbol, TpaPopupSymbol, TpaSymbol } from './symbols'

export const TpaCurrentCurrencyManager = withDependencies(
	[
		Props,
		StructureAPI,
		TpaEventsListenerManagerSymbol,
		CurrentRouteInfoSymbol,
		BrowserWindowSymbol,
		pageIdSym,
		TpaSrcBuilderSymbol,
		TpaPopupSymbol,
		TpaSymbol,
	],
	(
		props: IPropsStore,
		structureAPI: IStructureAPI,
		tpaEventsListenerManager: ITPAEventsListenerManager,
		currentRouteInfo: ICurrentRouteInfo,
		browserWindow: BrowserWindow,
		pageId: string,
		tpaSrcBuilder: ITpaSrcBuilder,
		{ getOpenedPopups }: ITpaPopup,
		{ rebuildTpasSrc }: ITpa
	): ISamePageUrlChangeListener => {
		// When the currency query param is changed, refresh all TPAs, so their currentCurrency will get updated
		// accordingly in TpaSrcBuilder.buildSrc()
		const state: { previousCurrency: string | null } = { previousCurrency: null }

		return {
			onUrlChange(url) {
				const routerInfo = currentRouteInfo.getCurrentRouteInfo()
				if (!routerInfo) {
					return
				}

				const currency = url.searchParams.get('currency')
				if (currency === state.previousCurrency) {
					return
				}

				// Refresh static TPAs
				rebuildTpasSrc()

				// Refresh runtime TPAs
				Object.entries(getOpenedPopups()).forEach(([_id, tpaCompData]) => {
					tpaCompData.refreshPopUp()
				})
				// TODO: The same also for modals.

				state.previousCurrency = currency
			},
		}
	}
)

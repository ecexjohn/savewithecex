import { withDependencies } from '@wix/thunderbolt-ioc'
import { ITpaModal, ITpaPopup } from '../types'
import { TpaModalSymbol, TpaPopupSymbol } from '../symbols'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'

export const CloseWindowHandler = withDependencies(
	[TpaModalSymbol, TpaPopupSymbol],
	(tpaModal: ITpaModal, tpaPopup: ITpaPopup): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				closeWindow(compId, onCloseMessage: any) {
					if (tpaPopup.isPopup(compId)) {
						tpaPopup.closePopup(compId, onCloseMessage)
					} else {
						tpaModal.closeModal(onCloseMessage)
					}
				},
			}
		},
	})
)

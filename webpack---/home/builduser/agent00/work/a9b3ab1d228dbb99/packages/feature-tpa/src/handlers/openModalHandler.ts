import { withDependencies } from '@wix/thunderbolt-ioc'
import { ITpaModal } from '../types'
import { TpaModalSymbol } from '../symbols'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'

export type MessageData = {
	url: string
	width: number
	height: number
	theme: string
}

export const OpenModalHandler = withDependencies(
	[TpaModalSymbol],
	(tpaModal: ITpaModal): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				openModal(compId, { url, theme, height, width }: MessageData) {
					return tpaModal.openModal(url, { width, height, theme }, compId)
				},
			}
		},
	})
)

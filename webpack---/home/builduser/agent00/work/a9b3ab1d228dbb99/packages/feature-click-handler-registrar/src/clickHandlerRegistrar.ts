import { multi, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	ILinkClickHandler,
	LinkClickHandlerSymbol,
	NavigationClickHandlerSymbol,
	IPageDidMountHandler,
	SiteLinkClickHandlerSymbol,
	pageIdSym,
} from '@wix/thunderbolt-symbols'

type HTMLElementTarget = HTMLElement | null
const getAnchorTarget = (event: MouseEvent) => {
	let eTarget = event.target as HTMLElementTarget

	while (eTarget && (!eTarget.tagName || eTarget.tagName.toLowerCase() !== 'a')) {
		eTarget = eTarget.parentNode as HTMLElementTarget
	}
	return eTarget
}

const cancelEvent = (e: MouseEvent) => {
	e.stopPropagation()
	e.preventDefault()
	return false
}

const clickHandlerRegistrarFactory = (
	pageId: string,
	browserWindow: NonNullable<BrowserWindow>,
	navigationHandler: ILinkClickHandler,
	siteLinkClickHandlers: Array<ILinkClickHandler>,
	pageLinkClickHandlers: Array<ILinkClickHandler>
): IPageDidMountHandler => {
	return {
		pageDidMount: () => {
			const onClick = async (e: MouseEvent) => {
				const anchorTarget = getAnchorTarget(e)
				if (!anchorTarget) {
					return
				}
				if (anchorTarget.getAttribute('data-cancel-link')) {
					cancelEvent(e)
					return
				}
				const handlers =
					pageId === 'masterPage'
						? [...siteLinkClickHandlers, ...pageLinkClickHandlers]
						: [...pageLinkClickHandlers, navigationHandler]
				for (const handler of handlers) {
					const didHandle = handler.handleClick(anchorTarget)
					if (didHandle) {
						e.preventDefault()
						e.stopPropagation()
						return
					}
				}
			}
			browserWindow.addEventListener('click', onClick)
			return () => {
				browserWindow.removeEventListener('click', onClick)
			}
		},
	}
}

export const ClickHandlerRegistrar = withDependencies(
	[
		pageIdSym,
		BrowserWindowSymbol,
		NavigationClickHandlerSymbol,
		multi(SiteLinkClickHandlerSymbol),
		multi(LinkClickHandlerSymbol),
	],
	clickHandlerRegistrarFactory
)

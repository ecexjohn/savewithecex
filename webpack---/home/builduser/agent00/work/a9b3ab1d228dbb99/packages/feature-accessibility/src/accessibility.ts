import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol, IPageDidMountHandler } from '@wix/thunderbolt-symbols'

const accessibilityFactory = (window: BrowserWindow): IPageDidMountHandler => {
	return {
		async pageDidMount() {
			const addFocusRingClass = (event: KeyboardEvent): void => {
				if (event.key === 'Tab') {
					// TODO: Think of a better way to get the site container in page features
					const target: HTMLElement = window!.document.getElementById('SITE-CONTAINER')!
					target.classList.add('focus-ring-active')
				}
				window!.removeEventListener('keydown', addFocusRingClass)
			}
			window!.addEventListener('keydown', addFocusRingClass)
		},
	}
}

export const Accessibility = withDependencies([BrowserWindowSymbol], accessibilityFactory)

const candidateSelectors = ['input', 'select', 'a[href]', 'textarea', 'button', '[tabindex]:not([tabindex="-1"])'].join(
	','
)

export const enableCyclicTabbing = () => {
	if (!process.env.browser) {
		return
	}

	const focusableElements = document.querySelectorAll(candidateSelectors)
	focusableElements.forEach((focusableElement) => {
		const candidateTabIndex =
			focusableElement.getAttribute('tabindex') || `${(focusableElement as HTMLElement).tabIndex}`
		focusableElement.setAttribute('tabindex', '-1')
		focusableElement.setAttribute('data-restore-tabindex', candidateTabIndex)
	})
}
export const disableCyclicTabbing = () => {
	if (!process.env.browser) {
		return
	}

	const focusableElements = document.querySelectorAll(candidateSelectors)
	focusableElements.forEach((focusableElement) => {
		const restoreTabIndex = focusableElement.getAttribute('data-restore-tabindex')
		if (restoreTabIndex) {
			focusableElement.setAttribute('tabindex', restoreTabIndex)
			focusableElement.removeAttribute('data-restore-tabindex')
		}
	})
}

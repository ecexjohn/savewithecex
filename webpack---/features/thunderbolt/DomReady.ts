import { withDependencies } from '@wix/thunderbolt-ioc'
import { DomReadySymbol, IAppWillMountHandler, ILogger, LoggerSymbol } from '@wix/thunderbolt-symbols'

export const createDomReadyPromise = () =>
	new Promise((resolve) => {
		const verifyAndResolve = () => {
			verifyBody()
			resolve()
		}
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			verifyAndResolve()
		} else {
			document.addEventListener('DOMContentLoaded', verifyAndResolve)
		}
	})

export const WaitForDomReady = withDependencies<IAppWillMountHandler>(
	[DomReadySymbol, LoggerSymbol],
	(domReady, logger) => ({
		appWillMount: () => domReady.then(() => reportDomReady(logger)),
	})
)

function reportDomReady(logger: ILogger) {
	logger.phaseMark('domReady')
}

function verifyBody(): void {
	const ssrReturnedBody = typeof window.clientSideRender !== 'undefined'
	if (ssrReturnedBody) {
		return
	}

	window.clientSideRender = true
	window.santaRenderingError = window.santaRenderingError || {
		errorInfo: 'body failed to render',
	}

	const pagesCss = window.document.createElement('pages-css')
	pagesCss.setAttribute('id', 'pages-css')
	window.document.body.appendChild(pagesCss)

	const siteContainer = window.document.createElement('DIV')
	siteContainer.setAttribute('id', 'SITE-CONTAINER')
	window.document.body.appendChild(siteContainer)
}

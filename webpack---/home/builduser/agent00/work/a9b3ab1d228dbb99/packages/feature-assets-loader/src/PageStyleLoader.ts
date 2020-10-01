import { withDependencies } from '@wix/thunderbolt-ioc'
import { DomReadySymbol, HeadContentSymbol, IHeadContent } from '@wix/thunderbolt-symbols'
import { PageResourceFetcherSymbol } from './symbols'
import { IPageResourceFetcher } from './IPageResourceFetcher'

export type ILoadPageStyle = {
	load(pageId: string): Promise<void>
}

export const ClientPageStyleLoader = withDependencies<ILoadPageStyle>(
	[PageResourceFetcherSymbol, DomReadySymbol],
	(pageResourceFetcher: IPageResourceFetcher, domReadyPromise: Promise<void>) => ({
		async load(pageId): Promise<void> {
			const id = `css_${pageId}`
			await domReadyPromise

			if (document.getElementById(id)) {
				return
			}

			const css = await pageResourceFetcher.fetchResource(pageId, 'css', 'enable')

			const styleElement = window.document.createElement('style')
			styleElement.setAttribute('id', id)
			styleElement.innerHTML = css
			window.document.getElementById('pages-css')!.appendChild(styleElement)
		},
	})
)

export const ServerPageStyleLoader = withDependencies<ILoadPageStyle>(
	[HeadContentSymbol, PageResourceFetcherSymbol],
	(headContent: IHeadContent, pageResourceFetcher: IPageResourceFetcher) => ({
		async load(pageId) {
			const css = await pageResourceFetcher.fetchResource(pageId, 'css', 'enable')
			headContent.addPageCss(`<style id="css_${pageId}">${css}</style>`)
		},
	})
)

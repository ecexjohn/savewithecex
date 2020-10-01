import { withDependencies } from '@wix/thunderbolt-ioc'
import { HeadContentType, IHeadContent } from '@wix/thunderbolt-symbols'

type HeadContentFactory = () => IHeadContent

const headContent: HeadContentFactory = () => {
	const headStatic: Record<string, string> = {}
	const headOther: Array<string> = []
	const pagesCss: Array<string> = []

	return {
		setHead: (content: string, type?: HeadContentType) => {
			switch (type) {
				case HeadContentType.SEO:
				case HeadContentType.SEO_DEBUG:
					headStatic[type] = content
					break
				default:
					headOther.push(content)
					break
			}
		},
		addPageCss: (css) => pagesCss.push(css),
		getPagesCss: () => pagesCss.join('\n'),
		getHead: () => {
			return [...Object.values(headStatic), ...headOther].join('\n')
		},
		getHeadByType: (type) => {
			switch (type) {
				case HeadContentType.SEO:
				case HeadContentType.SEO_DEBUG:
					return headStatic[type]
				default:
					return headOther
			}
		},
	}
}

export const HeadContent = withDependencies([], headContent)

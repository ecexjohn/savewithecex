import { ILanguage } from '@wix/thunderbolt-symbols'

const ALL_LANGUAGE_CODES: Record<string, string> = {
	ar: 'ar',
	bg: 'bg',
	zh: 'zh',
	cs: 'cs',
	da: 'da',
	nl: 'nl',
	fi: 'fi',
	fr: 'fr',
	de: 'de',
	el: 'el',
	he: 'he',
	hi: 'hi',
	hu: 'hu',
	id: 'id',
	it: 'it',
	ja: 'ja',
	jp: 'ja',
	ko: 'ko',
	kr: 'ko',
	ms: 'ms',
	no: 'no',
	pl: 'pl',
	pt: 'pt',
	ro: 'ro',
	ru: 'ru',
	es: 'es',
	sv: 'sv',
	tl: 'tl',
	th: 'th',
	tr: 'tr',
	uk: 'uk',
}

export const getTranslationUrl = (translationsBaseUrl: string, userLanguage: ILanguage['userLanguage']) =>
	`${translationsBaseUrl}/resources/santa-viewer/bundles/_generated/santa_viewer_${ALL_LANGUAGE_CODES[userLanguage] ||
		'en'}.json`

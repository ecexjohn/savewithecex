import { IWarmupDataProvider, WarmupDataProviderSymbol } from 'feature-warmup-data'
import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	Fetch,
	Translate,
	ITranslate,
	ITranslationsFetcher,
	ILanguage,
	IFetchApi,
	LanguageSymbol,
	FeatureStateSymbol,
	IRendererPropsExtender,
} from '@wix/thunderbolt-symbols'
import { getTranslationUrl } from './translationsUrl'
import { Translations, TranslationsFeatureState, TranslationsWarmupData } from './types'
import { IFeatureState } from 'thunderbolt-feature-state'

const translationsImpl = (
	fetchApi: IFetchApi,
	{ userLanguage, translationsBaseUrl }: ILanguage,
	featureState: IFeatureState<TranslationsFeatureState>,
	warmupDataProvider: IWarmupDataProvider
): (() => Promise<ITranslate>) => {
	return async () => {
		if (!featureState.get()?.translations) {
			featureState.update(() => ({
				translations: warmupDataProvider
					.getWarmupData<TranslationsWarmupData>('translations')
					.then(
						(translations) =>
							translations ||
							fetchApi.getJson<Translations>(getTranslationUrl(translationsBaseUrl, userLanguage))
					),
			}))
		}

		const translations = await featureState.get().translations

		return (featureNamespace, key, defaultValue) =>
			(translations[featureNamespace] && translations[featureNamespace][key]) || defaultValue
	}
}

const translateBinder = (translationsFetcher: ITranslationsFetcher): IRendererPropsExtender => ({
	async extendRendererProps() {
		return { translate: await translationsFetcher() }
	},
})

export const TranslationsImpl = withDependencies(
	[Fetch, LanguageSymbol, named(FeatureStateSymbol, 'translations'), WarmupDataProviderSymbol],
	translationsImpl
)
export const TranslateBinder = withDependencies([Translate], translateBinder)

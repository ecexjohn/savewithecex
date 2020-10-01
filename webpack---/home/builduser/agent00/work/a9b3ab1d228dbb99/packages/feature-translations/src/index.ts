import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { RendererPropsExtenderSym, Translate } from '@wix/thunderbolt-symbols'
import { TranslationsImpl, TranslateBinder } from './translations'
import { WarmupDataEnricherSymbol } from 'feature-warmup-data'
import { TranslationWarmupDataEnricher } from './translationsWarmupDataEnricher'

export const site: ContainerModuleLoader = (bind) => {
	bind(Translate).to(TranslationsImpl)
	bind(RendererPropsExtenderSym).to(TranslateBinder)

	if (!process.env.browser) {
		bind(WarmupDataEnricherSymbol).to(TranslationWarmupDataEnricher)
	}
}

import _ from 'lodash'
import * as defaultTranslations from '../../assets/locale/viewer/messages_en.json'
import { SUPPORT_LANGUAGES } from '../../constants/supported-languages'

const loadTranslation = async ({ baseUrl, locale }) => {
  if (!_.includes(SUPPORT_LANGUAGES, locale)) {
    return defaultTranslations
  }

  const url = `${baseUrl}assets/locale/viewer/messages_${locale}.json`
  const res = await fetch(url)
  return res.ok ? res.json() : defaultTranslations
}

export const i18n = async ({ baseUrl, locale }) => {
  let translations = defaultTranslations

  try {
    translations = await loadTranslation({ baseUrl, locale })
  } catch {}

  return {
    t: (key, options?) => {
      let translatedValue = _.get(translations, key, key)

      if (options) {
        translatedValue = _.reduce(
          options,
          (result, value, key) => {
            const pattern = new RegExp(`{{${key}}}`, 'ig')
            return _.replace(result, pattern, value)
          },
          translatedValue,
        )
      }

      return translatedValue
    },
  }
}

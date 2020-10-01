import _ from 'lodash'
import { FormPlugin } from '@wix/forms-common'
import { TranslationFunction } from 'i18next'

const getEnvName = () => process.env.NODE_ENV || ''
export const isProduction = () => getEnvName() !== 'development' && getEnvName() !== 'test'

export const bindObjectFunctions = (editorSDK, token) => {
  return _.mapValues(editorSDK, val => {
    if (_.isFunction(val)) {
      return val.bind(editorSDK, token)
    } else if (_.isPlainObject(val)) {
      return bindObjectFunctions(val, token)
    }

    return val
  })
}

export function getStackTrace() {
  try {
    throw new Error()
  } catch (e) {
    return e.stack.toString() || ''
  }
}

export function getStackTraceSSR() {
  const fakeError = new Error()
  return fakeError.stack ? fakeError.stack.toString() : ''
}

export const getAppUrl = (origin = 'editor-app'): string =>
  isProduction()
    ? `https://static.parastorage.com/services/wix-form-builder/${getAppVersion()}/${origin}.bundle.min.js`
    : `https://localhost:3200/${origin}.bundle.min.js`

export const getBaseUrl = () => {
  const url: string = _.head(getAppUrl().match(/((?:\/[^\/]+)+)(?=\/[^\/]+)/))
  return `${(url && url.substring(1)) || ''}`
}

export const getAppVersion = () => {
  // we are not actually accessing window here, it's replaced via webpack's define plugin
  if (isProduction()) {
    return window.__CI_APP_VERSION__.replace('-SNAPSHOT', '')
  }

  return 'local-development'
}

export const getStaticsBaseUrl = () => `${getBaseUrl()}/assets/statics`

export const innerText = str => str.replace(/\s*<[^>]*>\s*/gm, '')

export const escapeRegExp = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') //eslint-disable-line no-useless-escape

export const getEditorSentryDSN = () =>
  'https://e2430572bdbe4204942352f7014b2049@sentry.wixpress.com/52'

export const getViewerSentryDSN = () =>
  'https://6b4c4ea790f34e0db1e7e0e30eeb6a06@sentry.wixpress.com/51'

export const safelyStringify = obj => {
  // taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
  const seen = []
  try {
    if (obj instanceof Error) {
      return obj
    }

    return JSON.stringify(obj, (_key, value) => {
      if (value != null && typeof value === 'object') {
        if (seen.indexOf(value) >= 0) {
          return
        }
        seen.push(value)
      }
      return value
    })
  } catch (err) {
    return ''
  }
}

// https://github.com/sindresorhus/serialize-error/
export const serializeError = value => {
  if (typeof value === 'object') {
    return safelyStringify(value)
  }
  // People sometimes throw things besides Error objects, so…
  if (typeof value === 'function') {
    // JSON.stringify discards functions. We do too, unless a function is thrown directly.
    return `[Function: ${value.name || 'anonymous'}]`
  }
  return value
}

export const createSuffixedName = (names, name, separator = ' '): string => {
  if (_.includes(names, name)) {
    let suffix = 2
    while (_.includes(names, `${name}${separator}${suffix}`)) {
      suffix++
    }
    return `${name}${separator}${suffix}`
  }
  return name
}

export const isWixEmployeeEmail = email => {
  return _.endsWith(email, '@wix.com')
}

export const getFieldTooltipContent = ({
  t,
  fallback,
  type,
  plugins,
}: {
  t: TranslationFunction
  fallback: string
  type: FieldPreset
  plugins: FormPlugin[]
}) => {
  const firstPluginWithTranslation = _.find(plugins, p => {
    const fieldKey = `missingFieldTooltip.${p}.${type}`
    const translatedValue = t(fieldKey)
    return translatedValue !== fieldKey // found field key with translation
  })

  if (!firstPluginWithTranslation) {
    return t(fallback)
  }

  return t(`missingFieldTooltip.${firstPluginWithTranslation}.${type}`)
}

export const shiftListItems = <T>(fields: T[], start: number, end: number): T[] => {
  if (start < end) {
    return shiftRight(fields, start, end)
  } else {
    return shiftLeft(fields, end, start)
  }
}

const shiftRight = (fields, start, end) => {
  let tempObject
  while (start < end) {
    tempObject = fields[start]
    fields[start] = fields[start + 1]
    fields[start + 1] = tempObject
    start++
  }
  return fields
}

const shiftLeft = (fields, start, end) => {
  let tempObject
  while (start < end) {
    tempObject = fields[end]
    fields[end] = fields[end - 1]
    fields[end - 1] = tempObject
    end--
  }
  return fields
}

export const getTranslationByPlugin = ({ t, prefix, plugin, postfix }) => {
  const key = `${prefix}.${_.camelCase(plugin)}.${postfix}`

  const translation = t(key)

  if (key === translation) {
    const fallbackKey = `${prefix}.${_.camelCase(FormPlugin.FORM_BUILDER)}.${postfix}`
    return t(fallbackKey)
  }

  return translation
}

export const withRetries = ({ attempt, maxRetries = 2, delay = 100 }) => async (...args) => {
  let retryCount = 0

  do {
    try {
      return await attempt(...args)
    } catch (error) {
      const isLastAttempt = retryCount === maxRetries
      if (isLastAttempt) {
        return Promise.reject(error)
      }
    }

    await new Promise(resolve => setTimeout(resolve, delay))
  } while (retryCount++ < maxRetries)
}

export const EMPTY_EMAIL_ID = '00000000-0000-0000-0000-000000000000'
export const isNotEmptyEmailId = emailId => !(_.isEmpty(emailId) || emailId === EMPTY_EMAIL_ID)

export const fetcher = <T>(): DataResolver<T> => {
  let resolveCall
  const fetcherPromise: Promise<T> = new Promise(resolve => {
    resolveCall = resolve
  })
  return {
    resolveData: resolveCall,
    getData: fetcherPromise,
  }
}

export const parseInstance = instance => JSON.parse(atob(instance.split('.')[1]))

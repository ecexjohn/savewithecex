import { getAppVersion, serializeError } from '../../utils/utils'
import { sanitizePII } from '@wix/bi-logger-sanitizer/dist/src/lib/sanitizers'
import { FORMS_APP_DEF_ID, FORMS_WIDGET_ID } from '../../constants'
import Experiments from '@wix/wix-experiments'
import _ from 'lodash'
import {
  IAppData,
  IPlatformAPI,
  IWixAPI,
  IPlatformServices,
  IFedOpsLogger,
} from '@wix/native-components-infra/dist/src/types/types'
import { RavenStatic } from 'raven-js'
import { AppSettingsViewer } from '../services/app-settings-viewer'
import { FetchAppSettingsError } from '../errors'

const sanitizeBiLogger = (fields = {}) => {
  const sanitizedFields = {}

  Object.keys(fields).forEach((fieldName) => {
    sanitizedFields[fieldName] = sanitizePII(fields[fieldName])
  })

  return sanitizedFields
}

type AppData = IAppData & {
  url: string
}

type PlatformAPI = IPlatformAPI & {
  links: {
    toUrl: Function
  }
}

class SiteStore {
  private _ravenInstance: RavenStatic
  private _biLogger
  private _fedopsLogger: IFedOpsLogger
  private _t
  private _experiments: Experiments
  private _release: string
  private _platformServicesAPI: IPlatformServices
  private _scopedGlobalSdkApis: IWixAPI
  private _initAppParams: AppData
  private _platformApi: PlatformAPI

  constructor() {
    this._release = getAppVersion()
  }

  public async init({
    initAppParams,
    platformApi,
    scopedGlobalSdkApis,
    platformServicesAPI,
    experiments,
    translationsFactory,
    ravenInstance,
  }) {
    this._ravenInstance = ravenInstance
    this._platformApi = platformApi
    this._initAppParams = initAppParams
    this._platformServicesAPI = platformServicesAPI
    this._scopedGlobalSdkApis = scopedGlobalSdkApis

    this._initFedopsLogger()
    this._initRavenContext()
    this._initBiLogger()

    return Promise.all([
      this._initExperiments({ experiments }),
      this._initTranslations({ translationsFactory }),
    ])
  }

  private async _initExperiments({ experiments }) {
    // await experiments.load('forms-viewer') // TODO: Uncomment once we have experiments in viewer
    this._experiments = experiments
  }

  private async _initTranslations({ translationsFactory }) {
    const locale = _.get(this._scopedGlobalSdkApis, 'site.language', 'en')
    await translationsFactory.init(locale)

    this._t = translationsFactory.t
  }

  private _initRavenContext() {
    this._ravenInstance.setRelease(this._release)

    const userMonitoringContext = {
      id: this._initAppParams.instanceId,
      url: this._scopedGlobalSdkApis.location.baseUrl,
      uuid: this._platformServicesAPI.bi.visitorId,
    }

    this._ravenInstance.setUserContext(userMonitoringContext)
  }

  private _initBiLogger() {
    const loggerFactory = this._platformServicesAPI.biLoggerFactory()
    const appVersion = getAppVersion()
    this._biLogger = loggerFactory.updateDefaults({ src: 5, appVersion }).logger()
  }

  private _initFedopsLogger() {
    if (this._platformServicesAPI.fedOpsLoggerFactory.getLoggerForWidget) {
      this._fedopsLogger = this._platformServicesAPI.fedOpsLoggerFactory.getLoggerForWidget({
        appId: FORMS_APP_DEF_ID,
        widgetId: FORMS_WIDGET_ID,
      })
    }
  }

  private _getExtraLoggingData(err) {
    const biParamsForExtra = ['requestId', 'viewerSessionId', 'pageId']
    const biParamsForTags = [
      'metaSiteId',
      'artifactVersion',
      'isCached',
      'isServerSide',
      'viewerName',
      'dc',
      'isPreview',
    ]

    const extra = {
      queryParams: _.get(this._scopedGlobalSdkApis, 'location.query'),
      errorObject: serializeError(err),
    }
    const tags = {}

    _.forEach(biParamsForTags, (paramName) => {
      const paramValue = _.get(this._platformServicesAPI, `bi.${paramName}`)
      if (paramValue !== undefined) {
        tags[paramName] = paramValue
      }
    })

    _.forEach(biParamsForExtra, (paramName) => {
      const paramValue = _.get(this._platformServicesAPI, `bi.${paramName}`)
      if (paramValue !== undefined) {
        extra[paramName] = paramValue
      }
    })

    return { extra, tags }
  }

  t(key, options = {}) {
    return this._t(key, options)
  }

  log(fields) {
    const sanitizedFields = sanitizeBiLogger(fields)
    return this._biLogger.log(sanitizedFields, { endpoint: 'form-builder' })
  }

  async loadSettings({ externalId, instanceId }): Promise<ControllerSettings> {
    try {
      if (!externalId) {
        return { ok: true, data: { rules: [] } }
      }

      this.interactionStarted('load-settings')

      const data = await AppSettingsViewer({
        appDefId: FORMS_APP_DEF_ID,
        scope: 'COMPONENT',
        externalId,
        instanceId,
      }).getAll()

      this.interactionEnded('load-settings')

      return {
        ok: true,
        data,
      }
    } catch (err) {
      this.captureException(new FetchAppSettingsError(err), {
        extra: { externalId, instanceId },
      })

      return {
        err,
        ok: false,
      }
    }
  }

  isEnabled(spec) {
    try {
      return this._experiments.enabled(spec)
    } catch (_e) {
      return false
    }
  }

  interactionStarted(interactionName) {
    if (this._fedopsLogger) {
      this._fedopsLogger.interactionStarted(interactionName)
    }
  }

  interactionEnded(interactionName) {
    if (this._fedopsLogger) {
      this._fedopsLogger.interactionEnded(interactionName)
    }
  }

  appLoadStarted() {
    if (this._fedopsLogger) {
      this._fedopsLogger.appLoadStarted()
    }
  }

  appLoaded() {
    if (this._fedopsLogger) {
      this._fedopsLogger.appLoaded()
    }
  }

  captureException(err, options = {}) {
    if (this._ravenInstance) {
      const { extra, tags } = this._getExtraLoggingData(err)
      this._ravenInstance.captureException(err, _.merge({}, { extra, tags }, options))
      this._ravenInstance.setTagsContext()
      this._ravenInstance.setExtraContext()
    }
  }

  captureMessage(message, options = undefined) {
    if (this._ravenInstance) {
      this._ravenInstance.captureMessage(message, options)
    }
  }

  captureBreadcrumb(crumb) {
    if (this._ravenInstance) {
      this._ravenInstance.captureBreadcrumb(crumb)
    }
  }

  get initAppParams() {
    return this._initAppParams
  }

  get platformApi() {
    return this._platformApi
  }

  get wixApi() {
    return this._scopedGlobalSdkApis
  }

  get platformServices() {
    return this._platformServicesAPI
  }

  private _getAppToken() {
    return this.wixApi.site.getAppToken(FORMS_APP_DEF_ID)
  }

  async instance() {
    let updatedInstance = this._getAppToken()

    if (!updatedInstance) {
      try {
        const siteApi = this.wixApi.site as any
        if (siteApi.loadNewSession) {
          await siteApi.loadNewSession()
          updatedInstance = this._getAppToken()
        }
      } catch (err) {}
    }

    return updatedInstance
  }
}

export const siteStore = new SiteStore()

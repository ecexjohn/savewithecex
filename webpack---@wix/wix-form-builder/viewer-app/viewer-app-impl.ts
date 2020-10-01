import { ROLE_FORM, FIELDS } from '../constants/roles'
import _ from 'lodash'
import {
  escapeRegExp,
  innerText,
  isTemplate,
  isPreviewMode,
  shouldSendData,
  findPlugin,
  componentStringify,
} from './viewer-utils'
import { submitUtils } from './submit-utils'
import { FormPlugin } from '@wix/forms-common'
import { isPaymentAllowed } from './services/payment-services'
import { VIEWER_ORIGIN, EVENTS } from '../constants/bi-viewer'
import { CRM_TYPES } from '../constants/crm-types-tags'
import { siteStore } from './stores/site-store'
import Experiments from '@wix/wix-experiments'
import translations from './services/translations'
import { serializeError, getViewerSentryDSN, getAppVersion } from '../utils/utils'
import { RavenStatic } from 'raven-js'
import { CorvidAPI } from './corvid-api'
import { FieldValidity, ErrorName, SubmitFailedError } from './errors'
import { getController, IController } from './controllers/controllers'

const ERROR_COLOR = '#FF4040'

let initialized = false

interface SubmitArgs {
  $w
  controller: IController
  corvidAPI: CorvidAPI
  isPaymentForm: boolean
}

const initRavenInstance = ({ platformServicesAPI, scopedGlobalSdkApis, dsn }): RavenStatic => {
  return platformServicesAPI.monitoring.createMonitor(dsn, (event) => {
    const errors = _.chain(_.get(event, 'exception.values'))
      .map((exception) => (exception.message ? exception.message : exception.value))
      .compact()
      .value()

    event.fingerprint = errors.length > 0 ? [...errors] : ['{{ default }}']

    const appVersion = getAppVersion()
    const localEnvironment = appVersion === 'local-development'
    const isStaging =
      !!_.get(scopedGlobalSdkApis, 'location.query.viewerPlatformOverrides') ||
      !!_.get(scopedGlobalSdkApis, 'location.query.thunderboltStage')
    const isQAEnvironment =
      _.get(scopedGlobalSdkApis, 'location.query.isqa') === 'true' || isStaging
    const environment = localEnvironment ? 'Dev' : isQAEnvironment ? 'QA' : 'Prod'

    event.environment = environment

    return event
  })
}

export const initAppForPage = async (
  initAppParams,
  platformApi,
  scopedGlobalSdkApis,
  platformServicesAPI,
) => {
  if (initialized) {
    return Promise.resolve()
  }

  initialized = true

  const ravenInstance = initRavenInstance({
    platformServicesAPI,
    scopedGlobalSdkApis,
    dsn: getViewerSentryDSN(),
  })

  try {
    await siteStore.init({
      ravenInstance,
      initAppParams,
      platformApi,
      scopedGlobalSdkApis,
      platformServicesAPI,
      experiments: new Experiments(),
      translationsFactory: translations,
    })
  } catch (error) {
    ravenInstance.captureException(error)
    ravenInstance.setTagsContext()
    ravenInstance.setExtraContext()

    throw error
  }

  return Promise.resolve()
}

const getFormName = ($w, formId) => {
  const form = $w(`@${ROLE_FORM}`)

  return {
    form_comp_id: formId,
    form_name: _.get(form, 'connectionConfig.formName'),
    template: _.get(form, 'connectionConfig.preset', 'unknown'),
  }
}

const paymentStatusIsValid = (status) => ['Successful', 'Offline', 'Pending'].includes(status)

const getFormParamsForBi = ($w, numOfAttachments: number, wixLocation, formId: string) => ({
  num_of_attachments: numOfAttachments,
  form_url: wixLocation.url || '',
  ...getFormName($w, formId),
})

const logPublishSitePopupOpened = ($w, formId) =>
  siteStore.log({
    evid: EVENTS.PUBLISH_SITE_PANEL_OPENED,
    form_comp_id: getFormName($w, formId).form_comp_id,
    builderOrigin: VIEWER_ORIGIN,
  })

const getSubmitErrorParamsForBi = ({
  $w,
  numOfAttachments,
  wixLocation,
  reason,
  reason_body,
  formId,
}: {
  $w
  numOfAttachments: number
  wixLocation
  reason: string
  reason_body: string
  formId: string
}) => ({
  reason,
  reason_body,
  ...getFormParamsForBi($w, numOfAttachments, wixLocation, formId),
})

const showFormError = (message, errorMessage) => {
  if (!_.get(message, 'html')) {
    return
  }
  const colorRegExp = /color: ?[^;"]+/
  let htmlErrorMessage = errorMessage
  if (message.html.indexOf(colorRegExp) === -1) {
    htmlErrorMessage = `<span style="color: ${ERROR_COLOR}">${htmlErrorMessage}</span>`
  }
  message.html = message.html
    .replace(colorRegExp, `color: ${ERROR_COLOR}`)
    .replace(new RegExp(`>${escapeRegExp(innerText(message.html))}`), `>${htmlErrorMessage}`)
  message.show()
}

const resetCrucialFields = ($w) => {
  const captchaField = $w(`@${FIELDS.ROLE_FIELD_RECAPTCHA}`)

  if (captchaField.length > 0) {
    captchaField.reset()
  }
}

const onSubmit = async ({ $w, controller, corvidAPI, isPaymentForm }: SubmitArgs) => {
  let fields = []
  let $submitButton
  const { wixLocation, wixSite, wixWindow, wixPay } = controller.helpers

  const postSubmitActions = (shouldShowSubmissionSuccess = true, attachments = []) => {
    if (shouldShowSubmissionSuccess) {
      corvidAPI.fireFormSubmitted({ fields, attachments })
      submitUtils.resetFields(fields, controller.initialFields)
      controller.postSubmission()
    }

    if (!isTemplate(wixLocation)) {
      submitUtils.sendWixAnalytics({ wixSite, wixLocation, wixWindow })
    }
  }

  const numOfAttachments = controller.getNumOfAttachments()

  try {
    siteStore.log({
      evid: EVENTS.USER_CLICKS_SUBMIT,
      ...getFormParamsForBi($w, numOfAttachments, wixLocation, controller.formId),
    })

    $submitButton = submitUtils.getSubmitButton($w)
    $submitButton.disable()

    fields = controller.getFields()

    if (!controller.controllerSettings.ok) {
      throw new SubmitFailedError(controller.controllerSettings.err)
    }

    const invalidFields = submitUtils.validateFields({ fields, controller })

    if (invalidFields.length !== 0) {
      throw new FieldValidity({ fields })
    }

    const shouldShowPublishSitePopupWhenInPreviewMode = async () => {
      return (
        isPreviewMode(wixWindow) &&
        isPaymentForm &&
        siteStore.initAppParams.url &&
        (await isPaymentAllowed())
      )
    }

    if (await shouldShowPublishSitePopupWhenInPreviewMode()) {
      logPublishSitePopupOpened($w, controller.formId)
      const publishSitePopupUrl = () =>
        siteStore.initAppParams.url
          .split('/')
          .slice(0, -1)
          .concat(['assets', 'statics', `viewer-publish-site-panel.html`])
          .join('/')
      await wixWindow.openModal(
        `${publishSitePopupUrl()}?msid=${siteStore.platformServices.bi.metaSiteId}`,
        {
          width: 500,
          height: 247,
          theme: 'BARE',
        },
      )
      $submitButton.enable()
      return false
    }

    const attachments = await controller.getAttachments()

    if (!corvidAPI.fireFormSubmit({ fields, attachments, controller })) {
      $submitButton.enable()

      siteStore.log({
        evid: EVENTS.SUBMISSION_FAILURE,
        ...getSubmitErrorParamsForBi({
          $w,
          numOfAttachments,
          wixLocation,
          reason: 'onWixFormSubmit Hook',
          reason_body: 'aborted submission due to hook request',
          formId: controller.formId,
        }),
      })
      return false
    }

    if (shouldSendData(wixLocation)) {
      const serverResponse = await controller.execute({
        attachments,
        fields,
        formId: controller.formId,
      })

      let shouldShowSuccessMessage = true

      const orderId = _.get(serverResponse, 'orderId')

      if (orderId) {
        const userInfo = getUserInfo(fields)
        const paymentResponse = await wixPay.startPayment(orderId, {
          userInfo,
          allowManualPayment: true,
        })
        if (!paymentStatusIsValid(paymentResponse.status)) {
          shouldShowSuccessMessage = false
        }
      }

      // this event should be after all server requests (wix forms + wix data)
      siteStore.log({
        evid: EVENTS.SUBMISSION_SUCCESS,
        ...getFormParamsForBi($w, numOfAttachments, wixLocation, controller.formId),
      })

      postSubmitActions(shouldShowSuccessMessage, attachments)
      $submitButton.enable()
    } else {
      postSubmitActions()
      $submitButton.enable()
      return true
    }
  } catch (error) {
    const formMetadata = _.pick(_.get(controller.$form, 'connectionConfig'), [
      'formName',
      'plugins',
      'preset',
    ])
    const preset = _.get(formMetadata, 'preset')

    const isFieldValidityError = _.get(error, 'name') === ErrorName.FieldValidity

    if (!isFieldValidityError) {
      siteStore.captureException(error, {
        extra: {
          formMetadata,
        },
        ...(preset
          ? {
              tags: {
                preset,
              },
            }
          : {}),
      })
    }

    if ($submitButton) {
      $submitButton.enable()
    }

    corvidAPI.fireSubmitError({ error })
    if (!isFieldValidityError) {
      resetCrucialFields($w)
      showFormError(controller.$message, siteStore.t('submitFailed'))
    }

    siteStore.log({
      evid: EVENTS.SUBMISSION_FAILURE,
      ...getSubmitErrorParamsForBi({
        $w,
        numOfAttachments,
        wixLocation,
        reason: _.get(error, 'name', 'unknown reason'),
        reason_body: _.get(error, 'message', 'unknown message'),
        formId: controller.formId,
      }),
    })
  }
}

const getUserInfo = (fields) => {
  const wantedCrmTypes = [
    CRM_TYPES.FIRST_NAME,
    CRM_TYPES.LAST_NAME,
    CRM_TYPES.PHONE,
    CRM_TYPES.EMAIL,
  ]

  const userInfo = fields.reduce((acc, field) => {
    const {
      connectionConfig: { crmType },
    } = field
    if (!_.isEmpty(field.value) && wantedCrmTypes.includes(crmType)) {
      acc[crmType] = field.value
    }
    return acc
  }, {})

  return userInfo
}

const registerSubmitButtonIfExists = (submitArgs: SubmitArgs) => {
  const $submitButton = submitUtils.getSubmitButton(submitArgs.$w)

  if (!$submitButton) {
    return
  }

  if ($submitButton.onClick) {
    $submitButton.onClick(() => onSubmit(submitArgs))
  } else {
    siteStore.captureException(new Error('Missing click event on submit button'), {
      extra: {
        componentDataFromEvent: componentStringify($submitButton),
        componentDataFromController: componentStringify(
          _.get(submitArgs.controller.$submitButton, '[0]', {}),
        ),
        buttonFoundFromController: _.size(submitArgs.controller.$submitButton),
      },
    })
  }
}

const pageReadyImpl = async ({
  $w,
  payload,
  corvidAPI,
  controllerConfig,
}: {
  $w
  payload
  corvidAPI: CorvidAPI
  controllerConfig
}) => {
  try {
    if (!$w(`@${ROLE_FORM}`).length) {
      return
    }

    siteStore.appLoadStarted()

    const {
      appParams: { instanceId },
      externalId,
    } = controllerConfig
    const controllerSettings = await siteStore.loadSettings({ externalId, instanceId })

    const {
      window: wixWindow,
      location: wixLocation,
      user: wixUsers,
      site: wixSite,
      pay: wixPay,
    } = payload

    const form = _.get($w(`@${ROLE_FORM}`), '[0]')

    try {
      const connectionConfig = _.get(form, 'connectionConfig')
      if (!connectionConfig) {
        const $formFromController = _.get(controllerConfig.$w(`@${ROLE_FORM}`), '[0]')
        siteStore.captureException(new Error('Missing connectionConfig on form container'), {
          extra: {
            componentDataFromEvent: componentStringify(form),
            componentDataFromController: componentStringify($formFromController),
          },
        })
      }
    } catch (err) {
      siteStore.captureException(
        new Error('Failed to log missing connectionConfig on form container'),
        {
          extra: { err },
        },
      )
    }

    const useControllerId = _.get(form, 'connectionConfig.useControllerId', false)

    const plugins = _.get(form, 'connectionConfig.plugins')
    const paymentPlugin = findPlugin(plugins, FormPlugin.PAYMENT_FORM)
    const isPaymentForm = !!paymentPlugin && !!paymentPlugin.payload

    const formId = useControllerId ? controllerConfig.compId : form.uniqueId
    const formController = getController(plugins, {
      $w,
      formId,
      controllerSettings,
      wixLocation,
      wixPay,
      wixWindow,
      wixSite,
      wixUsers,
    })

    if (!formController) {
      return
    }

    const submitArgs: SubmitArgs = {
      $w,
      isPaymentForm,
      corvidAPI,
      controller: formController,
    }

    registerSubmitButtonIfExists(submitArgs)

    siteStore.appLoaded()
  } catch (err) {
    siteStore.captureException(err)
  }
}

export const createControllers = (controllerConfigs) =>
  controllerConfigs.map((controllerConfig) => {
    const { $w, type, wixCodeApi } = controllerConfig
    const corvidAPI = new CorvidAPI($w, type)
    const initialController = {
      pageReady: () => pageReadyImpl({ $w, payload: wixCodeApi, corvidAPI, controllerConfig }),
    }

    return Promise.resolve(corvidAPI.createController(initialController))
  })

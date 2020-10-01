import _ from 'lodash'
import { MultiStepFormController } from './multi-step-form-controller'
import { Attachment } from '../field-dto/field-dto'
import { ROLE_SUBMIT_BUTTON } from '../../constants/roles'
import { FormPlugin } from '@wix/forms-common'
import { SubmitFormResponse } from '../../types/domain-types'
import {
  isRegistrationFormEnabled,
  RegistrationFormController,
} from './registration-form-controller'
import { findPlugin } from '../viewer-utils'
import { BaseController } from './base-controller'

export interface IController {
  formId: string
  controllerSettings: ControllerSettings
  initialFields: { uniqueId; value }[]
  helpers: { wixLocation; wixSite; wixWindow; wixPay; wixUsers }
  $form
  $message
  $submitButton
  getFields: () => any[]
  getNumOfAttachments: () => number
  getAttachments: () => Promise<Attachment[]>
  validateFields: (fields: any[]) => any[]
  postSubmission: () => Promise<any>
  execute: ({
    attachments,
    fields,
    skipSendActivity,
  }: {
    attachments: Attachment[]
    fields: any[]
    skipSendActivity?: boolean
    formId: string
  }) => Promise<SubmitFormResponse>
}

export const getController = (
  plugins: ComponentPlugin[],
  { $w, formId, controllerSettings, wixLocation, wixSite, wixWindow, wixPay, wixUsers },
): IController => {
  if (!$w(`@${ROLE_SUBMIT_BUTTON}`)[0]) {
    return null
  }

  if (findPlugin(plugins, FormPlugin.MULTI_STEP_FORM)) {
    return new MultiStepFormController(
      {
        $w,
        formId,
        controllerSettings
      },
      { wixLocation, wixSite, wixWindow, wixPay, wixUsers },
    )
  }

  // for old users before plugins
  if (findPlugin(plugins, FormPlugin.REGISTRATION_FORM) || isRegistrationFormEnabled($w)) {
    return new RegistrationFormController(
      {
        $w,
        formId,
        controllerSettings
      },
      { wixLocation, wixSite, wixWindow, wixPay, wixUsers },
    )
  }

  return new BaseController(
    {
      $w,
      formId,
      controllerSettings
    },
    { wixLocation, wixSite, wixWindow, wixPay, wixUsers },
  )
}

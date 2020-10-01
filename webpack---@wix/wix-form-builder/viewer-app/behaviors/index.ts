import _ from 'lodash'
import { siteStore } from '../stores/site-store'
import { RegisterBehaviorError } from '../errors'
import { addContactsValidation } from './contacts-validation'
import { addRegistrationFormValidation } from './registration-form-validation'
import { registerCaptchaFieldIfExists } from './captcha-field'
import { registerRulesIfExists } from './rules'
// import { registerPaymentFieldsIfExists } from './payment-fields'

const behaviors = [
  { name: 'Contacts Fields', func: addContactsValidation },
  { name: 'Registration Form', func: addRegistrationFormValidation },
  { name: 'Captcha', func: registerCaptchaFieldIfExists },
  { name: 'Rules', func: registerRulesIfExists },
  // { name: 'Payment Fields', func: registerPaymentFieldsIfExists },
]

export const registerBehaviors = (submitArgs: {
  $w
  formId: string
  controllerSettings: ControllerSettings
  fields,
}) =>
  _.forEach(behaviors, (behaviorData) => {
    try {
      behaviorData.func(submitArgs)
    } catch (err) {
      siteStore.captureException(new RegisterBehaviorError(err, behaviorData.name))
    }
  })

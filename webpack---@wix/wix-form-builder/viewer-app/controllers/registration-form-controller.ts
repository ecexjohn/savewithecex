import _, { isNumber } from 'lodash'
import { RegistrationFieldPreset, CUSTOM_FIELD, CRM_TYPES } from '@wix/forms-common'
import { SubmitFormResponse } from '../../types/domain-types'
import { FIELDS } from '../../constants/roles'
import { siteStore } from '../stores/site-store'
import { getInputValue } from '../input-value'
import { sanitizePII } from '@wix/bi-logger-sanitizer/dist/src/lib/sanitizers'
import { RegistrationError } from '../errors'
import { getFieldType } from '../viewer-utils'
import { BaseController } from './base-controller'

export class RegistrationFormController extends BaseController {
  private _firstInitialization
  constructor(
    {
      $w,
      formId,
      controllerSettings,
    }: {
      $w
      formId: string
      controllerSettings: ControllerSettings
    },
    { wixLocation, wixSite, wixWindow, wixPay, wixUsers },
  ) {
    super({ $w, formId, controllerSettings }, { wixLocation, wixSite, wixWindow, wixPay, wixUsers })
  }

  protected _init() {
    super._init()

    this._firstInitialization = {
      [FIELDS.ROLE_FIELD_REGISTRATION_FORM_LOGIN_EMAIL]: true,
      [FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD]: true,
    }
    this._registerPasswordValidation()
    this._registerLoginLink()
  }

  private _registerPasswordValidation() {
    const password = passwordField(this.$w)

    if (!password) return

    password.onCustomValidation((value, reject) => {
      if (this._firstInitialization[FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD]) {
        this._firstInitialization[FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD] = false
        return
      }

      if (value.length < PASSWORD_LENGTH.MIN || value.length > PASSWORD_LENGTH.MAX) {
        //tslint:disable-line
        reject(
          siteStore.t('registrationForm.passwordLimitError', {
            min: PASSWORD_LENGTH.MIN,
            max: PASSWORD_LENGTH.MAX,
          }),
        )
      }
    })
  }

  private _registerLoginLink() {
    const loginLink = linkLoginField(this.$w)
    if (!loginLink) return
    loginLink.onClick(() => {
      this.helpers.wixUsers.promptLogin({ mode: 'login' })
      this.helpers.wixWindow.lightbox.close()
    })
  }

  public async execute({ attachments, fields }): Promise<SubmitFormResponse> {
    if (this.helpers.wixWindow.viewMode === PREVIEW_MODE) {
      return Promise.resolve({})
    }
    const { email, password, joinTheCommunityCheckbox } = getFields(this.$w)
    const privacyStatus =
      joinTheCommunityCheckbox && joinTheCommunityCheckbox.checked ? 'PUBLIC' : 'PRIVATE'
    const payload = { defaultFlow: true, privacyStatus }

    const validFields = fields.filter(
      (field) =>
        field.connectionConfig.crmType &&
        !_.isEmpty(getInputValue(field, attachments)) &&
        !IGNORED_FIELDS_WITHOUT_EMAIL[field.connectionConfig.fieldType],
    )

    await super.execute({ attachments, fields: submitFields(validFields) })

    const contactInfo = buildContactInfo(validFields)
    payload['contactInfo'] = contactInfo

    try {
      siteStore.interactionStarted('registration')
      await this.helpers.wixUsers.register(email.value, password.value, payload)
      siteStore.interactionEnded('registration')
    } catch (e) {
      if (typeof e === 'string') {
        const sanitizedErrorMessage = sanitizePII(e)

        if (_.startsWith(e, 'member with email')) {
          siteStore.interactionEnded('registration') // expected exception, shouldn't be counted as error
          throw new RegistrationError('member already exists in collection', sanitizedErrorMessage)
        }

        throw new RegistrationError(sanitizedErrorMessage)
      }

      throw new RegistrationError('SDK Error', e)
    }
  }

  public postSubmission() {
    setTimeout(() => this.helpers.wixWindow.lightbox.close(), 750)
    return Promise.resolve()
  }
}

const PASSWORD_LENGTH = { MIN: 4, MAX: 15 }
const PREVIEW_MODE = 'Preview'

const getFields = ($w) => {
  const email: any = loginEmailField($w)
  const password: any = passwordField($w)
  const joinTheCommunityCheckbox: any = joinTheCommunityCheckboxField($w)
  return { email, password, joinTheCommunityCheckbox }
}

const loginEmailField = ($w): any =>
  _($w(`@${FIELDS.ROLE_FIELD_REGISTRATION_FORM_LOGIN_EMAIL}`)).first()
const passwordField = ($w): any => _($w(`@${FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD}`)).first()
const linkLoginField = ($w): any =>
  _($w(`@${FIELDS.ROLE_FIELD_REGISTRATION_FORM_LINK_TO_LOGIN_DIALOG}`)).first()
const joinTheCommunityCheckboxField = ($w): any =>
  _($w(`@${FIELDS.ROLE_FIELD_REGISTRATION_FORM_CHECKBOX_JOIN_COMMUNITY}`)).first()

const submitFields = (fields) =>
  fields.filter((field) => _.get(field, 'connectionConfig.fieldType') !== 'password')

const IGNORED_FIELDS_WITHOUT_EMAIL = {
  [RegistrationFieldPreset.REGISTRATION_FORM_PASSWORD]: true,
  [RegistrationFieldPreset.REGISTRATION_FORM_CHECKBOX_AGREE_TERMS]: true,
  [RegistrationFieldPreset.REGISTRATION_FORM_CHECKBOX_JOIN_COMMUNITY]: true,
}

const valueHandlerByType = {
  DatePicker: ({ value }) => value,
}

const getFieldValue = (field) => {
  const fieldType = getFieldType(field)
  const fieldValue = valueHandlerByType[fieldType]
    ? valueHandlerByType[fieldType](field)
    : getInputValue(field)
  return isNumber(field) ? +fieldValue : fieldValue
}

const buildContactInfo = (validFields) => {
  const contactInfo = {
    phones: [],
    emails: [],
  }

  validFields.forEach((field) => {
    const { crmType, customFieldId, customFieldName } = field.connectionConfig
    const fieldValue = getFieldValue(field)
    switch (crmType) {
      case CRM_TYPES.EMAIL:
        contactInfo.emails.push(fieldValue)
        break
      case CRM_TYPES.PHONE:
        contactInfo.phones.push(fieldValue)
        break
      case CUSTOM_FIELD:
        if (customFieldId) {
          contactInfo[customFieldName] = fieldValue
        }
        break
      default:
        contactInfo[crmType] = fieldValue
    }
  })
  return contactInfo
}

export const isRegistrationFormEnabled = ($w) => {
  const { email, password } = getFields($w)
  return email && password
}

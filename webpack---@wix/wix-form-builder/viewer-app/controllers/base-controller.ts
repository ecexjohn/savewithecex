import _ from 'lodash'
import { Attachment, getFieldValue, createFieldDto } from '../field-dto/field-dto'
import { submitUtils } from '../submit-utils'
import {
  FIELDS_ROLES,
  ROLE_FORM,
  ROLE_MESSAGE,
  ROLE_DOWNLOAD_MESSAGE,
  FIELDS,
  ROLE_SUBMIT_BUTTON,
} from '../../constants/roles'
import { FormsFieldPreset, SuccessActionTypes, SecondsToResetDefaults } from '@wix/forms-common'
import { isNotEmptyEmailId } from '../../utils/utils'
import { EmailConfig, Field, SubmitFormResponse, SubmitFormRequest } from '../../types/domain-types'
import { siteStore } from '../stores/site-store'
import {
  isUploadButton,
  isRadioGroup,
  isCaptchaField,
  replaceMessageInnerText,
  toMiliseconds,
  getBaseUrl,
} from '../viewer-utils'
import { post } from '../services/fetch-utils'
import { registerBehaviors } from '../behaviors'
import { IController } from './controllers'

export class BaseController implements IController {
  protected attachments: { [uniqueId: string]: Attachment }
  protected fields: any[]
  protected $w

  public helpers: { wixLocation; wixSite; wixWindow; wixPay; wixUsers }
  public formId: string
  public controllerSettings: ControllerSettings
  public initialFields: { uniqueId; value }[]
  public $form: any
  public $message: any
  public $submitButton: any

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
    this.$w = $w
    this.formId = formId
    this.controllerSettings = controllerSettings
    this.helpers = { wixLocation, wixSite, wixWindow, wixPay, wixUsers }

    this._init()
  }

  protected _init() {
    this.$form = _.get(this.$w(`@${ROLE_FORM}`), '[0]')
    const successMessage = this.$w(`@${ROLE_MESSAGE}`)
    const downloadMessage = this.$w(`@${ROLE_DOWNLOAD_MESSAGE}`)

    if (_.get(successMessage, 'hide')) {
      successMessage.hide()
      this.$message = successMessage
    }

    if (_.get(downloadMessage, 'hide')) {
      downloadMessage.hide()
      this.$message = downloadMessage
    }

    this.$submitButton = this.$w(`@${ROLE_SUBMIT_BUTTON}`)
    this.fields = submitUtils.getFields({ $w: this.$w, roles: FIELDS_ROLES })
    this.attachments = {}
    this.initialFields = this.fields.map(({ uniqueId, value }) => ({ uniqueId, value }))

    this._registerNumberInputValidation()

    registerBehaviors({
      $w: this.$w,
      formId: this.formId,
      controllerSettings: this.controllerSettings,
      fields: [...this.fields, _.first(this.$submitButton)],
    })
  }

  public getFields() {
    return this.fields
  }

  public getNumOfAttachments() {
    return _.filter(this.fields, (field) => isUploadButton(field) && field.value.length > 0).length
  }

  public async getAttachments() {
    const fieldsWithoutAttachments = this.getFields()
    return [
      ...(await submitUtils.getAttachments(fieldsWithoutAttachments)),
      ...(await submitUtils.getSignatureAttachments({
        currentFields: fieldsWithoutAttachments,
        formId: this.formId,
      })),
    ]
  }

  private _registerNumberInputValidation() {
    const fields = this.fields.filter((field) => field.role === FIELDS.ROLE_FIELD_TEXT)
    const numbers = _.filter(fields, (field) => _.get(field, 'inputType') == 'number')

    _.forEach(numbers, (number) => {
      if (number.onBlur) {
        number.onBlur((e) => {
          number.value = e.target.value
        })
      }
    })
  }

  public validateFields(fields: any[]): any[] {
    const fieldsToTestValidity = _.filter(fields, (field) => !field.collapsed)

    return _.reject(fieldsToTestValidity, (field) => {
      if (isRadioGroup(field)) {
        // TODO - waiting for full fix for radioGroup
        return !field.required || field.value.length > 0
      }

      if (isCaptchaField(field)) {
        return !_.isEmpty(field.token)
      }

      if (isUploadButton(field)) {
        if (!field.validity.fileNotUploaded || (field.required && field.value.length === 0)) {
          return field.valid
        }
        return true
      }

      if ('valid' in field) {
        return field.valid
      }

      return true
    })
  }

  public async execute({ attachments, fields }): Promise<SubmitFormResponse> {
    return sendActivity(this.$w, {
      attachments,
      fields,
      wixWindow: this.helpers.wixWindow,
      formId: this.formId,
    })
  }

  async postSubmission() {
    const { secondsToResetForm, successActionType, successLinkValue } = this.$form.connectionConfig
    switch (successActionType) {
      case SuccessActionTypes.LINK:
      case SuccessActionTypes.EXTERNAL_LINK:
        setTimeout(
          () => this.helpers.wixLocation.to(siteStore.platformApi.links.toUrl(successLinkValue)),
          100,
        )
        return Promise.resolve()

      case SuccessActionTypes.DOWNLOAD_DOCUMENT:
        if (_.get(this.$message, 'html', undefined) === undefined) {
          return Promise.resolve()
        }
        replaceMessageInnerText(
          this.$message,
          (innerText) =>
            `<a href="${siteStore.platformApi.links.toUrl(
              successLinkValue,
            )}" target="_blank" role="alert">${innerText}</a>`,
        )
        this.$message.show()
        return Promise.resolve()

      default:
        const hasMessageContent = _.get(this.$message, 'html', undefined) !== undefined
        const timedMessage =
          hasMessageContent &&
          secondsToResetForm >= SecondsToResetDefaults.MIN &&
          secondsToResetForm <= SecondsToResetDefaults.MAX
        const previousMessage: string = timedMessage && this.$message.html

        if (hasMessageContent) {
          replaceMessageInnerText(
            this.$message,
            (innerText) => `<span role="alert">${innerText}</span>`,
          )
          this.$message.show()
        }

        return timedMessage
          ? new Promise((resolve) =>
              setTimeout(() => {
                this.$message.html = previousMessage
                resolve(this.$message.hide())
              }, toMiliseconds(secondsToResetForm)),
            )
          : Promise.resolve()
    }
  }
}

const getRecipients = (emailIds: string[]) => {
  const sendToOwner: boolean = _.isEmpty(emailIds[0])
  const actualEmailIds: string[] = emailIds.filter(isNotEmptyEmailId)

  return { sendToOwner, emailIds: actualEmailIds }
}

const createEmailConfig = ({
  emailIds,
  selectedSiteUsersIds,
  inboxOptOut,
}: {
  emailIds: string[]
  selectedSiteUsersIds?: string[]
  inboxOptOut?: boolean
}): EmailConfig => {
  const recipients = getRecipients(emailIds)

  if (!_.isBoolean(inboxOptOut) || inboxOptOut) {
    if (recipients.sendToOwner) {
      return {
        sendToOwnerAndEmails: {
          emailIds: [...recipients.emailIds],
        },
      }
    }

    return {
      sendToEmails: {
        emailIds: [...recipients.emailIds],
      },
    }
  } else {
    if (!selectedSiteUsersIds) {
      if (recipients.sendToOwner) {
        return {
          sendToOwner: {},
        }
      }
    }

    return {
      sendToContributors: {
        userIds: selectedSiteUsersIds || [],
      },
    }
  }
}

const FILTERED_FIELDS = [FormsFieldPreset.GENERAL_RECAPTCHA]

const createFieldsDto = ({ fields, attachments, options }) => {
  const fieldsDto = []

  const validFields = _.filter(
    fields,
    (field) => !_.includes(FILTERED_FIELDS, _.get(field, 'connectionConfig.fieldType')),
  )

  _.forEach(validFields, (field: WixCodeField) => {
    const fieldDto: Field = createFieldDto({ field, attachments, options })
    fieldsDto.push(fieldDto)
  })

  return fieldsDto
}

const enrichPayloadWithCaptcha = ({ $w, payload }) => {
  const captchaField = $w(`@${FIELDS.ROLE_FIELD_RECAPTCHA}`)

  if (captchaField.length > 0) {
    const value = getFieldValue(captchaField)
    payload.security = { captcha: value }
  }
}

const sendActivity = async ($w, { attachments, fields, wixWindow, formId }) => {
  siteStore.interactionStarted('submission')

  const form = $w(`@${ROLE_FORM}`)
  const {
    emailId,
    secondEmailId,
    emailIds,
    labels,
    formName = '',
    selectedSiteUsersIds,
    inboxOptOut,
    doubleOptIn,
  } = form.connectionConfig

  const fieldsDto: Field[] = createFieldsDto({ fields, attachments, options: { doubleOptIn } })
  const emailConfig: EmailConfig = createEmailConfig({
    emailIds: emailIds || [emailId, secondEmailId],
    selectedSiteUsersIds,
    inboxOptOut,
  })

  const payload: SubmitFormRequest = {
    formProperties: {
      formName,
      formId,
    },
    emailConfig,
    viewMode: wixWindow.viewMode,
    fields: fieldsDto,
    labelIds: _.compact(labels),
  }

  enrichPayloadWithCaptcha({ $w, payload })

  const shouldDisableRetry = _.has(payload, 'security')
  const baseUrl = getBaseUrl()

  const response = await post<SubmitFormResponse>(
    baseUrl,
    '_api/wix-forms/v1/submit-form',
    payload,
    shouldDisableRetry,
  )

  siteStore.interactionEnded('submission')

  return response
}

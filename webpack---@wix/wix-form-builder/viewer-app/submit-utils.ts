import { ROLE_SUBMIT_BUTTON } from '../constants/roles'
import {
  isCheckbox,
  isSignatureField,
  isUploadButton,
  isCaptchaField,
  getFieldValueByCrmType,
  isTimePicker,
  getBaseUrl,
} from './viewer-utils'
import _ from 'lodash'
import { Attachment } from './field-dto/field-dto'
import { post } from './services/fetch-utils'
import { CRM_TYPES } from '../constants/crm-types-tags'
import { siteStore } from './stores/site-store'
import { UploadFileError, UploadSignatureError } from './errors'
import { UploadSignatureResponse, SubmitFormResponse } from '../types/domain-types'
import { IController } from './controllers/controllers'

class SubmitUtils {
  public getSubmitButton($w) {
    return $w(`@${ROLE_SUBMIT_BUTTON}`)[0]
  }

  public getFields({ $w, roles }): any {
    const fields = roles.reduce((res, roleField) => res.concat($w(`@${roleField}`)), [])
    return _.uniqBy(fields, (field: { uniqueId: string }) => field.uniqueId)
  }

  public validateFields({ fields, controller }: { fields: any[]; controller: IController }): any[] {
    fields.forEach((field) => {
      if (field.collapsed) {
        return
      }

      if (field.updateValidityIndication) {
        field.updateValidityIndication()
      }
    })

    const invalidFields = controller.validateFields(fields)

    if (invalidFields.length > 0) {
      if (invalidFields[0].scrollTo) {
        invalidFields[0].scrollTo()
      }
    }

    return invalidFields
  }

  public async getAttachments(fields): Promise<Attachment[]> {
    const uploadButtons = fields.filter((field) => isUploadButton(field) && field.value.length > 0)

    if (!uploadButtons.length) {
      return Promise.resolve([])
    }

    siteStore.interactionStarted('upload-files')

    try {
      const attachments: Attachment[] = await Promise.all(
        uploadButtons.map(
          async (uploadButtonField): Promise<Attachment> => {
            const { url, width, height, mediaId, title } = await uploadButtonField.startUpload()

            return {
              url,
              name: uploadButtonField.value[0].name,
              value: '',
              uniqueId: uploadButtonField.uniqueId,
              width,
              height,
              mediaId,
              title,
            }
          },
        ),
      )

      siteStore.interactionEnded('upload-files')

      return attachments
    } catch (err) {
      throw new UploadFileError(err)
    }
  }

  private async _startSignatureUpload({ formId, signatureField, name }): Promise<Attachment> {
    const { value, uniqueId } = signatureField
    const baseUrl = getBaseUrl()

    const data = await post<UploadSignatureResponse>(baseUrl, '_api/wix-forms/v1/media/signature', {
      formId,
      signature: value,
      namePrefix: name,
    })

    return {
      url: data.url,
      name: data.name,
      value: value,
      uniqueId: uniqueId,
    }
  }

  private async _getSignatureName(fields) {
    return (
      getFieldValueByCrmType(fields, CRM_TYPES.LAST_NAME) ||
      getFieldValueByCrmType(fields, CRM_TYPES.EMAIL) ||
      getFieldValueByCrmType(fields, CRM_TYPES.FIRST_NAME) ||
      ''
    )
  }

  public async getSignatureAttachments({
    currentFields,
    formId,
    allFields,
  }: {
    currentFields: any[]
    formId: string
    allFields?: any[]
  }): Promise<Attachment[]> {
    const signatureFields = currentFields.filter(
      (field) => isSignatureField(field) && field.value.length > 0,
    )

    if (!signatureFields.length) {
      return Promise.resolve([])
    }

    siteStore.interactionStarted('upload-signatures')

    const signatureName = await this._getSignatureName(allFields || currentFields)

    try {
      const data: Attachment[] = await Promise.all(
        signatureFields.map((signatureField) =>
          this._startSignatureUpload({
            formId,
            signatureField,
            name: signatureName,
          }),
        ),
      )

      siteStore.interactionEnded('upload-signatures')

      return data
    } catch (e) {
      throw new UploadSignatureError(e)
    }
  }

  private _getCurrentPageName({ wixSite, wixLocation }) {
    const siteStructure = wixSite.getSiteStructure()

    const currentPath = wixLocation.path

    let currentPageName

    const validPageUrl = _.findLast(currentPath, (url) => !_.isEmpty(_.trim(url)))

    if (validPageUrl) {
      const currentPageStructure = _.find(siteStructure.pages, ['url', `/${validPageUrl}`])
      currentPageName = _.get(currentPageStructure, 'name')
    } else {
      const homePageStructure = _.find(siteStructure.pages, ['isHomePage', true])
      currentPageName = _.get(homePageStructure, 'name')
    }

    return currentPageName
  }

  public sendWixAnalytics({ wixSite, wixLocation, wixWindow }) {
    const currentPageName = this._getCurrentPageName({ wixSite, wixLocation })

    if (!currentPageName) return

    wixWindow.trackEvent('Lead', {
      label: `Page Name: ${currentPageName}`,
    })
  }

  public resetFields(fields, initialFields) {
    fields.forEach((field) => {
      if (isUploadButton(field) || isCaptchaField(field)) {
        if ('reset' in field) {
          field.reset()
        }
        return
      }

      if (isSignatureField(field)) {
        field.clear()
        return
      }

      if (isTimePicker(field)) {
        const initialTimeField = _.find(initialFields, { uniqueId: field.uniqueId })
        field.value = initialTimeField.value || ''
        field.resetValidityIndication()
        return
      }

      if (isCheckbox(field)) {
        field.checked = false
      } else {
        field.value = null
      }

      if ('resetValidityIndication' in field) {
        field.resetValidityIndication()
      }
    })
  }
}

export const submitUtils = new SubmitUtils()

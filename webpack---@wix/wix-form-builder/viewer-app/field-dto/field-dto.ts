import _ from 'lodash'
import { CRM_TYPES, CUSTOM_FIELD } from '../../constants/crm-types-tags'
import {
  StandardField,
  TaggedField,
  Field,
  CustomField,
  AttachmentField,
  SubscribeField,
  AdditionalField,
} from '../../types/domain-types'
import { FormsFieldPreset, AdiFieldPreset } from '@wix/forms-common'
import { getFieldType, FIELD_TYPE, getFieldRawValue } from '../viewer-utils'

export interface Attachment {
  url: string
  name: string
  value: any
  uniqueId: string
  width?: number
  height?: number
  mediaId?: string
  title?: string
}

const FIELD_VALUE_TYPE = {
  RATING: 'rating',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  TIME: 'time',
  SUBSCRIBE: 'subscribe',
  STRING: 'string',
  ATTACHMENT: 'attachmentV2',
  SIGNATURE: 'signature',
  ADDITIONAL: 'additional',
  CUSTOM: 'custom',
  ARRRAY: 'array',
}

const getFieldValueType = field => {
  const fieldType = getFieldType(field)

  switch (fieldType) {
    case FIELD_TYPE.RATING:
      return FIELD_VALUE_TYPE.RATING
    case FIELD_TYPE.CHECKBOX:
      return FIELD_VALUE_TYPE.CHECKBOX
    case FIELD_TYPE.DATE:
      return FIELD_VALUE_TYPE.DATE
    case FIELD_TYPE.TIME:
      return FIELD_VALUE_TYPE.TIME
    case FIELD_TYPE.CHECKBOX_GROUP:
      return FIELD_VALUE_TYPE.ARRRAY
    default:
      return FIELD_VALUE_TYPE.STRING
  }
}

export const getFieldValue = field => {
  const fieldType = getFieldType(field)

  const rawValue = getFieldRawValue(field)

  switch (fieldType) {
    case FIELD_TYPE.RATING:
      if (rawValue) {
        return Number(rawValue)
      }
      break
    case FIELD_TYPE.DATE:
      if (!rawValue) return
      const padZero = num => _.padStart(num, 2, '0')
      return `${rawValue.getFullYear()}-${padZero(rawValue.getMonth() + 1)}-${padZero(rawValue.getDate())}`
    case FIELD_TYPE.CHECKBOX_GROUP:
      return { values: rawValue }
    case FIELD_TYPE.TIME: {
      return { value: rawValue, format: field.useAmPmFormat ? 'AMPM' : 'FULL' }
    }
    default:
      return rawValue
  }
}

const standardField = (field): StandardField => ({ value: getFieldValue(field) })

const taggedField = (field): TaggedField => {
  const dto = standardField(field)

  const tag = getCrmTag(field)

  if (tag) {
    dto['tag'] = tag
  }

  return dto
}

export const attachmentField = (field, attachments: Attachment[]): AttachmentField => {
  const attachment = _.find<Attachment>(attachments, { uniqueId: field.uniqueId })

  return attachment
    ? {
        attachment: {
          name: attachment.name,
          url: attachment.url,
        },
      }
    : {}
}

export const getAttachment = (field, attachments: Attachment[]) =>
  _.find<Attachment>(attachments, { uniqueId: field.uniqueId })

const subscribeField = ({ field, options }): SubscribeField => {
  const valueType = getFieldValueType(field)
  const extraData: any = _.get(options, 'doubleOptIn') ? { mode: 'DOUBLE_OPT' } : {}

  return {
    [valueType]: getFieldValue(field),
    ...extraData,
  }
}

const attachmentCrmFieldTypes = [
  FormsFieldPreset.GENERAL_UPLOAD_BUTTON,
  AdiFieldPreset.ADI_UPLOAD_BUTTON,
  FormsFieldPreset.GENERAL_SIGNATURE, // same structure as attachment
]

const generalField = ({
  field,
  attachments,
  options,
}): AdditionalField | CustomField | AttachmentField | SubscribeField => {
  const crmFieldType = getFieldPreset(field)

  if (crmFieldType === FormsFieldPreset.GENERAL_SUBSCRIBE) {
    return subscribeField({ field, options })
  }

  if (_.includes(attachmentCrmFieldTypes, crmFieldType)) {
    return attachmentField(field, attachments)
  }

  const valueType = getFieldValueType(field)
  const fieldValue = getFieldValue(field)

  const fieldDto: CustomField | AdditionalField = {}

  if (fieldValue !== undefined) {
    fieldDto.value = {
      [valueType]: fieldValue,
    }
  }

  const customFieldId = getCustomFieldId(field)

  if (customFieldId) {
    fieldDto['customFieldId'] = customFieldId
  }

  return fieldDto
}

const getCrmType = field => _.get(field, 'connectionConfig.crmType')
const getCustomFieldId = field => _.get(field, 'connectionConfig.customFieldId')
const getCrmLabel = field => _.get(field, 'connectionConfig.crmLabel')
const getCrmTag = field => _.get(field, 'connectionConfig.crmTag')
const getFieldPreset = field => _.get(field, 'connectionConfig.fieldType')

const fieldDtoValueHandlerByCrmType = {
  [CRM_TYPES.FIRST_NAME]: field => standardField(field),
  [CRM_TYPES.LAST_NAME]: field => standardField(field),
  [CRM_TYPES.COMPANY]: field => standardField(field),
  [CRM_TYPES.POSITION]: field => standardField(field),
  [CRM_TYPES.EMAIL]: field => taggedField(field),
  [CRM_TYPES.PHONE]: field => taggedField(field),
  [CRM_TYPES.ADDRESS]: field => taggedField(field),
  [CRM_TYPES.DATE]: field => taggedField(field),
  [CRM_TYPES.WEBSITE]: field => taggedField(field),
}

const convertToServerFieldType = field => {
  const crmType = getCrmType(field)

  switch (crmType) {
    case CUSTOM_FIELD:
      const crmFieldType = getFieldPreset(field)
      switch (crmFieldType) {
        case FormsFieldPreset.GENERAL_SUBSCRIBE:
          return FIELD_VALUE_TYPE.SUBSCRIBE
        case AdiFieldPreset.ADI_UPLOAD_BUTTON:
        case FormsFieldPreset.GENERAL_UPLOAD_BUTTON:
          return FIELD_VALUE_TYPE.ATTACHMENT
        case FormsFieldPreset.GENERAL_SIGNATURE:
          return FIELD_VALUE_TYPE.SIGNATURE
        default:
          const customFieldId = getCustomFieldId(field)
          return _.isEmpty(customFieldId) ? FIELD_VALUE_TYPE.ADDITIONAL : FIELD_VALUE_TYPE.CUSTOM
      }
    default:
      return crmType
  }
}

export const createFieldDto = ({ field, attachments = [], options = {} }): Field => {
  const crmType = getCrmType(field)

  const fieldValueHandler = fieldDtoValueHandlerByCrmType[crmType]
  const fieldValue = fieldValueHandler
    ? fieldValueHandler(field)
    : generalField({ field, attachments, options })

  const serverCrmType = convertToServerFieldType(field)

  return {
    fieldId: field.uniqueId,
    label: getCrmLabel(field),
    [serverCrmType]: fieldValue,
  }
}

import _ from 'lodash'
import { FIELDS_ROLES } from '../../constants/roles'
import { submitUtils } from '../submit-utils'
import { CRM_TYPES } from '../../constants/crm-types-tags'
import { EMAIL_REGEX, URL_REGEX } from '../services/constants'

//https://github.com/wix-private/crm/blob/master/user-activity-domain/src/main/scala/com/wixpress/useractivity/entities/ContactUpdate.scala
export const CRM_MAX_LENGTH = {
  [CRM_TYPES.FIRST_NAME]: 100,
  [CRM_TYPES.ADDRESS]: 250,
  [CRM_TYPES.EMAIL]: 250,
  [CRM_TYPES.COMPANY]: 100,
  [CRM_TYPES.POSITION]: 100,
  [CRM_TYPES.LAST_NAME]: 100,
  [CRM_TYPES.PHONE]: 50,
}

const CRM_PATTERNS = {
  [CRM_TYPES.EMAIL]: EMAIL_REGEX,
  [CRM_TYPES.WEBSITE]: URL_REGEX,
}

export const addContactsValidation = ({ $w }) => {
  const fields = submitUtils.getFields({ $w, roles: FIELDS_ROLES })
  const maxLengthValidation = (field, crmType) => {
    const crmMaxLength = _.get(CRM_MAX_LENGTH, crmType)
    if (crmMaxLength) {
      const fieldMaxLength = _.isNumber(field.maxLength) ? field.maxLength : Infinity
      field.maxLength = Math.min(fieldMaxLength, crmMaxLength)
    }
  }

  const patternValidation = (field, crmType) => {
    if (CRM_PATTERNS[crmType]) {
      field.pattern = CRM_PATTERNS[crmType]
    }
  }

  fields.forEach(field => {
    const crmType = _.get(field, 'connectionConfig.crmType')
    maxLengthValidation(field, crmType)
    patternValidation(field, crmType)
  })
}

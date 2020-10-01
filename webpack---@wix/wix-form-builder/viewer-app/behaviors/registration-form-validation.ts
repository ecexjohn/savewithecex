import { FIELDS } from '../../constants/roles'
import { submitUtils } from '../submit-utils'

export const addRegistrationFormValidation = ({ $w }) => {
  const REQUIRED_REGISTRATION_TEXT_ROLES = [
    FIELDS.ROLE_FIELD_REGISTRATION_FORM_LOGIN_EMAIL,
    FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD,
  ]

  const requiredInputTextFields = submitUtils.getFields({
    $w,
    roles: REQUIRED_REGISTRATION_TEXT_ROLES,
  })

  requiredInputTextFields.forEach(field => {
    field.required = true
    field.resetValidityIndication()
  })
}

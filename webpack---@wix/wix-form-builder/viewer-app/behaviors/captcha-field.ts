import { FIELDS } from '../../constants/roles'
import { EVENTS } from '../../constants/bi-viewer'
import { siteStore } from '../stores/site-store'

export const getCaptchaField = $w => $w(`@${FIELDS.ROLE_FIELD_RECAPTCHA}`)[0] || null

export const onCaptchaVerify = ({ formRefId }: { formRefId: string }) =>
  logCaptchaEvent({ formRefId }, 'Verified')

export const onCaptchaTimeout = ({ formRefId }: { formRefId: string }) =>
logCaptchaEvent({ formRefId }, 'Expire')

export type CaptchaStatus = 'Verified' | 'Expire'

const logCaptchaEvent = (
  { formRefId }: { formRefId: string },
  authentication_status: CaptchaStatus
) =>
  siteStore.log({
    evid: EVENTS.CAPTCHA_ACTION,
    form_comp_id: formRefId,
    authentication_status,
  })

export const registerCaptchaFieldIfExists = ({ $w, formId }) => {
  const $captchaField = getCaptchaField($w)

  if (!$captchaField) {
    return
  }

  $captchaField.onVerified(() => onCaptchaVerify({ formRefId: formId }))
  $captchaField.onTimeout(() => onCaptchaTimeout({ formRefId: formId }))
}

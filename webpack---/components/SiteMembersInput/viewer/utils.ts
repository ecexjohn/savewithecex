import {
  PASS_MIN_LEN,
  PASS_MAX_LEN,
} from '../../MemberLoginDialog/viewer/constants';
import { IServerErrorResponse } from '../SiteMembersInput.types';

const keys = {
  retypePassword: {
    match: 'SMForm_Error_Password_Retype',
  },
  password: {
    required: 'SMForm_Error_Password_Blank',
    ascii: 'SMForm_Error_Non_Ascii_Chars',
    length: 'SMForm_Error_Password_Length',
  },
  email: {
    required: 'SMForm_Error_Email_Blank',
    format: 'SMForm_Error_Email_Invalid',
  },
};

export const serverErrorsHandler = (
  error: IServerErrorResponse | string | number,
): string => {
  let errorCode: string;
  if (typeof error === 'object') {
    errorCode = (error?.details?.errorcode ||
      'SMForm_Error_General_Err') as string;
  } else {
    errorCode = error as string;
  }
  errorCode = errorCode.toString().replace('-', '');
  return errorCode.includes('SMForm_Error_')
    ? errorCode
    : `SMForm_Error_${errorCode}`;
};

const isValidEmail = (emailToTest: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailToTest);
};

const isAscii = (char: string) => char.charCodeAt(0) < 127;
const isAsciiOnlyInput = (value: string) => Array.from(value).every(isAscii);

export const validateSiteMembersPassword = (
  value: string,
  translate: (key: string, defaultValue: string) => string,
): string | null => {
  if (value.length === 0) {
    return translate(keys.password.required, 'Password cannot be blank');
  }
  if (value.length < PASS_MIN_LEN || value.length > PASS_MAX_LEN) {
    return translate(
      keys.password.length,
      'Password length must be between {0} and {1}',
    )
      .replace('{0}', PASS_MIN_LEN.toString())
      .replace('{1}', PASS_MAX_LEN.toString());
  }
  if (!isAsciiOnlyInput(value)) {
    return translate(
      keys.password.ascii,
      'Password must contain only ASCII characters',
    );
  }

  return null;
};

export const validateSiteMembersRetypePassword = (
  value: string,
  password: string,
  translate: (key: string, defaultValue: string) => string,
): string | null => {
  const errorMessage = validateSiteMembersPassword(value, translate);
  if (errorMessage) {
    return errorMessage;
  }
  if (value !== password) {
    return translate(keys.retypePassword.match, 'Passwords are not the same');
  }
  return null;
};

export const validateSiteMembersEmail = (
  value: string,
  translate: (key: string, defaultValue: string) => string,
): string | null => {
  if (value.length === 0) {
    return translate(keys.email.required, 'Email cannot be blank');
  }
  if (!isValidEmail(value)) {
    return translate(keys.email.format, 'Email is invalid');
  }

  return null;
};

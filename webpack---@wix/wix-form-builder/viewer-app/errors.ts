import _ from 'lodash'
import { getFieldValidity } from './viewer-utils'
import { WixFormField } from './viewer-utils'

export const ErrorName = {
  FetchError: 'FetchError',
  NetworkError: 'NetworkError',
  RegistrationError: 'RegistrationError',
  UploadFileError: 'UploadFileError',
  UploadSignatureError: 'UploadSignatureError',
  FieldValidity: 'FieldValidityError',
  SubmitFailedError: 'SubmitFailedError',
  FetchAppSettingsError: 'FetchAppSettingsError',
  RegisterBehaviorError: 'RegisterBehaviorError',
  RulesExecutionFailedError: 'RulesExecutionFailedError',
  OnWixFormSubmitHookError: 'OnWixFormSubmitHookError',
}

export type FormError =
  | FieldValidity
  | FetchError
  | UploadFileError
  | UploadSignatureError
  | NetworkError
  | RegistrationError
  | SubmitFailedError
  | RegisterBehaviorError
  | RulesExecutionFailedError

export class FieldValidity extends Error {
  constructor({ fields }) {
    super(getFieldValidity(fields))

    this.name = ErrorName.FieldValidity
  }
}

export class RegisterBehaviorError extends Error {
  public readonly data

  constructor(error, behaviorName) {
    super(`Failed to register ${behaviorName} behavior`)
    this.name = ErrorName.RegisterBehaviorError
    this.data = error
  }
}

export class RulesExecutionFailedError extends Error {
  public readonly data

  constructor(error) {
    super('Failed to execute rules')
    this.name = ErrorName.RulesExecutionFailedError
    this.data = error
  }
}

export class FetchError extends Error {
  public readonly status
  public readonly data

  constructor({ endpoint, status, message }) {
    super(`Failed to fetch ${endpoint} with status code ${status}`)

    this.name = ErrorName.FetchError
    this.status = status
    this.data = message
  }
}

export class SubmitFailedError extends Error {
  public readonly data

  constructor(error) {
    super(`Submit failed due to missing app settings data`)

    this.name = ErrorName.SubmitFailedError
    this.data = error
  }
}

export class FetchAppSettingsError extends Error {
  public readonly data

  constructor(error) {
    super(`Failed to fetch app settings data`)

    this.name = ErrorName.FetchAppSettingsError
    this.data = error
  }
}

export class UploadFileError extends Error {
  public readonly data

  constructor(error) {
    const code = _.get(error, 'errorCode')
    const message = _.get(error, 'errorDescription')

    let errorDescription = ''

    if (code !== undefined) {
      errorDescription = `: ${code}`
    } else if (message) {
      errorDescription = `: ${message}`
    }

    super(`Failed to upload file${errorDescription}`)

    this.name = ErrorName.UploadFileError
    this.data = error
  }
}

export class UploadSignatureError extends Error {
  public readonly data

  constructor(error) {
    super('Failed to upload signature')

    this.name = ErrorName.UploadSignatureError
    this.data = error
  }
}

export class NetworkError extends Error {
  constructor({ endpoint }) {
    super(`Failed to fetch ${endpoint}`)

    this.name = ErrorName.NetworkError
  }
}

export class RegistrationError extends Error {
  public readonly data

  constructor(message, data?) {
    super(message)

    this.name = ErrorName.RegistrationError
    this.data = data
  }
}

export class OnWixFormSubmitHookError extends Error {
  public readonly data
  public readonly stacktrace

  constructor({
    msg,
    data,
    stacktrace,
  }: {
    msg: string
    data?: WixFormField[]
    stacktrace?: string
  }) {
    super(`${ErrorName.OnWixFormSubmitHookError} => ${msg}`)

    this.name = ErrorName.OnWixFormSubmitHookError
    this.data = data
    this.stacktrace = stacktrace
  }
}

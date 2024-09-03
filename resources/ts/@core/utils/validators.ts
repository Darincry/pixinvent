import { isEmpty, isEmptyArray, isNullOrUndefined } from './helpers'
import { getI18n } from '@/plugins/i18n'

const { t } = getI18n().global

// 👉 Required Validator
export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return t('This field is required')

  return !!String(value).trim().length || t('This field is required')
}

export const requiredValidatorIf = (value: unknown, target: boolean) => {
  if (target)
    return true

  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return t('This field is required')

  return !!String(value).trim().length || t('This field is required')
}

export const acceptedValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || value === false)
    return t('You need to accept the rules')

  return !!String(value).trim().length || t('You need to accept the rules')
}

// 👉 Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i

  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || t('The Email field must be a valid email')

  return re.test(String(value)) || t('The Email field must be a valid email')
}

// 👉 Password Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)

  return validPassword || t('Field must contain at least one uppercase, lowercase, special character and digit with min 8 chars')
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value: string, target: string) =>

  value === target || t('The Confirm Password field confirmation does not match')

// 👉 Between Validator
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `${t('Enter number between')} ${min} ${t('and')} ${max}`
}

// 👉 Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  if (Array.isArray(value))
    return value.every(val => /^-?\d+$/.test(String(val))) || t('This field must be an integer')

  return /^-?\d+$/.test(String(value)) || t('This field must be an integer')
}

// 👉 Regex Validator
export const regexValidator = (value: unknown, regex: RegExp | string): string | boolean => {
  if (isEmpty(value))
    return true

  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)

  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || t('The Regex field format is invalid')
}

// 👉 Alpha Validator
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || t('The Alpha field may only contain alphabetic characters')
}

// 👉 URL Validator
export const urlValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^https?:\/\/[^\s$.?#].\S*$/

  return re.test(String(value)) || t('URL is invalid')
}

// 👉 Length Validator
export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value))
    return true

  return String(value).length === length || t(`"The length of the Characters field must be ${length} characters."`)
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const valueAsString = String(value)

  return /^[\w-]*$/.test(valueAsString) || t('All Character are not valid')
}

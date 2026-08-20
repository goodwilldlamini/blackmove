import { z } from 'zod'
import { APP_MESSAGES } from './app-messages'

export function validateLink(val: string) {
  if (!val) {
    return APP_MESSAGES.form.fieldRequired
  }
  if (val.indexOf('http://') !== 0 && val.indexOf('https://') !== 0) {
    return `Link should start with 'http://' or 'https://'`
  }
  return null
}

export function validatePassword(value: string) {
  let error
  if (value == null || value === undefined || value.length < 1) {
    error = 'Please provide a password'
  } else if (value.length < 6) {
    error = 'Your password must have 6 or more characters'
  }

  return error
}

export function validateName(value: string) {
  let error
  if (value == null || value === undefined || value.length < 1) {
    error = APP_MESSAGES.form.fieldRequired
  } else if (value.trim().split(' ').length !== 2) {
    error = 'Please provide your name & surname divided by a space'
  }

  return error
}

export const phoneValidation = z
  .string()
  .min(1, APP_MESSAGES.form.fieldRequired)
  .length(10, 'Your phone number must have 10 digits')

export const emailValidation = z
  .string()
  .min(1, APP_MESSAGES.form.fieldRequired)
  .email()

export const passwordValidation = z
  .string()
  .min(1, 'Please provide a password')
  .min(6, 'Your password must contain atleast 6 characters')

export const loginFieldsValidation = z.object({
  email: emailValidation,
  phone: phoneValidation,
})

export const loginFieldsValidationWithPassword = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const requiredValidator = z.string().min(1, APP_MESSAGES.form.fieldRequired)

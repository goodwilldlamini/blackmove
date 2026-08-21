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

// an empty numeric field holds `undefined`, which this reports as required rather than a type error
export const numberValidator = z.number({ error: APP_MESSAGES.form.fieldRequired })

/**
 * Runs a zod schema as a TanStack form-level validator, mapping each issue onto its field.
 *
 * Passing a schema straight to `validators.onChange` requires its *input* type to match the form
 * values, which an empty numeric field (`undefined`) never does — the workarounds all bury the real
 * message under zod's generic "Invalid input". Validating by hand keeps the schemas idiomatic.
 */
export function zodFormValidator(schema: z.ZodType) {
  return ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value)
    if (result.success) return undefined
    const fields: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const key = issue.path.join('.')
      // first issue wins, matching how the schema-adapter surfaces one error per field
      if (key && !(key in fields)) fields[key] = issue.message
    }
    return { fields }
  }
}

// kept as text: account numbers can carry leading zeros and outgrow a safe integer
export const accountNumberValidator = z
  .string()
  .min(1, APP_MESSAGES.form.fieldRequired)
  .regex(/^\d+$/, 'Account number must contain digits only')

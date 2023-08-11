import * as yup from 'yup';

import { passwordPattern, passwordMessages, emailMessages } from './validationConstants';

export const loginSchema = yup
  .object({
    email: yup.string().required(emailMessages.required).email(emailMessages.incorrect),
    password: yup
      .string()
      .required(passwordMessages.required)
      .min(passwordPattern.min, passwordMessages.min)
      .matches(passwordPattern.number, passwordMessages.number)
      .matches(passwordPattern.special, passwordMessages.special)
      .matches(passwordPattern.latin, passwordMessages.lowerCase)
      .matches(passwordPattern.upperCase, passwordMessages.upperCase)
      .matches(passwordPattern.valid, passwordMessages.valid),
  })
  .required('');

export const passwordSchema = yup.object().shape({
  input: yup
    .string()
    .required(passwordMessages.required)
    .min(passwordPattern.min, passwordMessages.min)
    .matches(passwordPattern.number, passwordMessages.number)
    .matches(passwordPattern.special, passwordMessages.special)
    .matches(passwordPattern.latin, passwordMessages.lowerCase)
    .matches(passwordPattern.upperCase, passwordMessages.upperCase)
    .matches(passwordPattern.valid, passwordMessages.valid),
});

export const emailSchema = yup.object().shape({
  input: yup
    .string()
    .required(emailMessages.required)
    .email(emailMessages.incorrect)
    .trim(emailMessages.trim)
    .test('has-domain', emailMessages.domain, (value) => !!(value && value.includes('.')))
    .test('has-at-symbol', emailMessages.atSymbol, (value) => !!(value && value.includes('@'))),
});

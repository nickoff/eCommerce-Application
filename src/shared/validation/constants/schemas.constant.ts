import * as yup from 'yup';

import { PASSWORD_PATTERN, PASSWORD_MESSAGES, EMAIL_MESSAGES } from './patterns.constant';

export const LOGIN_SCHEMA = yup
  .object({
    email: yup.string().required(EMAIL_MESSAGES.required).email(EMAIL_MESSAGES.incorrect),
    password: yup
      .string()
      .required(PASSWORD_MESSAGES.required)
      .min(PASSWORD_PATTERN.min, PASSWORD_MESSAGES.min)
      .matches(PASSWORD_PATTERN.number, PASSWORD_MESSAGES.number)
      .matches(PASSWORD_PATTERN.special, PASSWORD_MESSAGES.special)
      .matches(PASSWORD_PATTERN.latin, PASSWORD_MESSAGES.lowerCase)
      .matches(PASSWORD_PATTERN.upperCase, PASSWORD_MESSAGES.upperCase)
      .matches(PASSWORD_PATTERN.valid, PASSWORD_MESSAGES.valid),
  })
  .required('');

export const PASSWORD_SCHEMA = yup.object().shape({
  input: yup
    .string()
    .required(PASSWORD_MESSAGES.required)
    .min(PASSWORD_PATTERN.min, PASSWORD_MESSAGES.min)
    .matches(PASSWORD_PATTERN.number, PASSWORD_MESSAGES.number)
    .matches(PASSWORD_PATTERN.special, PASSWORD_MESSAGES.special)
    .matches(PASSWORD_PATTERN.latin, PASSWORD_MESSAGES.lowerCase)
    .matches(PASSWORD_PATTERN.upperCase, PASSWORD_MESSAGES.upperCase)
    .matches(PASSWORD_PATTERN.valid, PASSWORD_MESSAGES.valid),
});

export const EMAIL_SCHEMA = yup.object().shape({
  input: yup
    .string()
    .required(EMAIL_MESSAGES.required)
    .email(EMAIL_MESSAGES.incorrect)
    .trim(EMAIL_MESSAGES.trim)
    .test('has-domain', EMAIL_MESSAGES.domain, (value) => !!(value && value.includes('.')))
    .test('has-at-symbol', EMAIL_MESSAGES.atSymbol, (value) => !!(value && value.includes('@'))),
});

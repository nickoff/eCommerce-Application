import * as yup from 'yup';

import {
  PASSWORD_PATTERN,
  PASSWORD_MESSAGES,
  EMAIL_MESSAGES,
  NAME_PATTERN,
  NAME_MESSAGES,
  DATE_OF_BIRTH_PATTERN,
  DATE_OF_BIRTH_MESSAGES,
  COUNTRY_MESSAGES,
  COUNTRIES,
  STREET_MESSAGES,
  STREET_PATTERN,
  PHONE_MESSAGES,
  PHONE_PATTERN,
  POSTAL_CODE_PATTERN,
  POSTAL_CODE_MESSAGES,
} from './patterns.constant';

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

export const NAME_SCHEMA = yup.object().shape({
  input: yup.string().required(NAME_MESSAGES.required).matches(NAME_PATTERN.latin, NAME_MESSAGES.latin),
});

export const DATE_OF_BIRTH_SCHEMA = yup.object().shape({
  input: yup
    .date()
    .typeError(DATE_OF_BIRTH_MESSAGES.typeError)
    .required(DATE_OF_BIRTH_MESSAGES.required)
    .max(DATE_OF_BIRTH_PATTERN.max, DATE_OF_BIRTH_MESSAGES.max),
});

export const COUNTRY_SCHEMA = yup.object().shape({
  input: yup.string().required(COUNTRY_MESSAGES.required).oneOf(COUNTRIES, COUNTRY_MESSAGES.oneOf),
});

export const STREET_SCHEMA = yup.object().shape({
  input: yup.string().required(STREET_MESSAGES.required).min(STREET_PATTERN.min, STREET_MESSAGES.min),
});

export const PHONE_SCHEMA = yup.object().shape({
  input: yup.string().required(PHONE_MESSAGES.required).matches(PHONE_PATTERN.valid, PHONE_MESSAGES.valid),
});

export const POSTAL_CODE_SCHEMA = yup.object().shape({
  input: yup.string().required(PHONE_MESSAGES.required).matches(POSTAL_CODE_PATTERN.valid, POSTAL_CODE_MESSAGES.valid),
});

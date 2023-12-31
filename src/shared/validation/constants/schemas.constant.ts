import * as yup from 'yup';
import isEmailUniqueDebounced from '../unique-email.validation';
import * as Pattern from './patterns.constant';
import * as Message from './messages.constant';

export const DEFAULT_STRING_SCHEMA = yup
  .string()
  .when('$required', ([required], schema) => (required ? schema.required(Message.REQUIRED) : schema));

export const PASSWORD_SCHEMA = DEFAULT_STRING_SCHEMA.required(Message.REQUIRED)
  .strict(true)
  .trim(Message.PASSWORD.trim)
  .min(Pattern.PASSWORD.min, Message.PASSWORD.min)
  .matches(Pattern.PASSWORD.number, Message.PASSWORD.number)
  .matches(Pattern.PASSWORD.special, Message.PASSWORD.special)
  .matches(Pattern.PASSWORD.lowerCase, Message.PASSWORD.lowerCase)
  .matches(Pattern.PASSWORD.upperCase, Message.PASSWORD.upperCase);

export const PASSWORD_CONFIRM_SCHEMA = DEFAULT_STRING_SCHEMA.when('$getPwdValue', ([getPwdValue], schema) =>
  getPwdValue ? schema.test('passwords-do-match', "Passwords don't match", (value) => value === getPwdValue()) : schema,
);

export const EMAIL_SCHEMA = DEFAULT_STRING_SCHEMA.required(Message.REQUIRED)
  .strict(true)
  .trim(Message.EMAIL.trim)
  .email(Message.EMAIL.incorrect)
  .ensure()
  .test('has-domain', Message.EMAIL.domain, (value) => value.includes('.'))
  .test('has-at-symbol', Message.EMAIL.atSymbol, (value) => value.includes('@'));

export const EMAIL_UNIQUE_SCHEMA = yup
  .string()
  .ensure()
  .when('$currentEmail', ([currentEmail], schema) =>
    schema.test('is-unique', Message.EMAIL.exist, (value) => isEmailUniqueDebounced(value, currentEmail)),
  );

export const DATE_OF_BIRTH_SCHEMA = yup
  .date()
  .when('$required', ([required], schema) => (required ? schema.required(Message.REQUIRED) : schema))
  .typeError(Message.DATE_OF_BIRTH.typeError)
  .max(Pattern.DATE_OF_BIRTH.max, Message.DATE_OF_BIRTH.max);

export const PHONE_SCHEMA = DEFAULT_STRING_SCHEMA.matches(Pattern.PHONE, Message.PHONE);

export const POSTAL_CODE_SCHEMA = DEFAULT_STRING_SCHEMA.matches(Pattern.POSTAL_CODE, {
  excludeEmptyString: true,
  message: Message.POSTAL_CODE,
});

export const NO_SPECIAL_SCHEMA = DEFAULT_STRING_SCHEMA.matches(Pattern.NO_SPECIAL, {
  excludeEmptyString: true,
  message: Message.NO_SPECIAL,
});

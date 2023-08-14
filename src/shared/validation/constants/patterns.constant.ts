import { Country } from '@shared/enums';

export const PASSWORD_PATTERN = {
  min: 8,
  number: /(?=.*[0-9])/g,
  special: /(?=.*[!@#$%-&*_-])/g,
  latin: /(?=.*[a-z])/g,
  upperCase: /(?=.*[A-Z])/g,
  valid: /[0-9a-zA-Z!@#$%-&*_-]{8,}/g,
};

export const NAME_PATTERN = {
  latin: /^[a-zA-Z]+$/g,
};

export const STREET_PATTERN = {
  min: 1,
};

export const DATE_OF_BIRTH_PATTERN = {
  max: new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
};

export const PHONE_PATTERN = {
  valid: /^(\+|8)[0-9]{9,}$/g,
};

export const POSTAL_CODE_PATTERN = {
  valid: /^\d{6}$/g,
};

export const PASSWORD_MESSAGES = {
  min: 'Password must be at least 8 characters long',
  number: 'Password must contain at least one digit (0-9)',
  special: 'Password must contain at least one special character (e.g., !@#$%-&*_-)',
  lowerCase: 'Password must contain at least one lowercase letter (a-z)',
  upperCase: 'Password must contain at least one uppercase letter (A-Z)',
  valid: 'Enter a valid password',
  trim: 'Password must not contain leading or trailing whitespace',
  mismatch: 'Passwords do not match',
  required: 'The field is required. Enter password',
};

export const EMAIL_MESSAGES = {
  required: 'The field is required. Enter E-mail',
  incorrect: 'E-mail entered incorrectly. Example: example@domain.com',
  domain: 'Email address must contain a domain name',
  trim: 'Email address must not contain leading or trailing whitespace',
  atSymbol: 'Email address must contain an "@" symbol separating local part and domain name',
};

export const NAME_MESSAGES = {
  latin: 'Enter a valid name',
  required: 'The field is required',
};

export const DATE_OF_BIRTH_MESSAGES = {
  max: 'You must be at least 13 years old',
  required: 'The field is required',
  typeError: 'Enter a valid date',
};

export const COUNTRY_MESSAGES = {
  required: 'The field is required',
  oneOf: `The field must be one of the following: ${Object.values(Country).join(', ')}`,
};

export const STREET_MESSAGES = {
  min: 'The field must be at least 1 characters long',
  required: 'The field is required',
};

export const PHONE_MESSAGES = {
  required: 'The field is required',
  valid: 'Enter a valid phone number',
};

export const POSTAL_CODE_MESSAGES = {
  required: 'The field is required',
  valid: 'Enter a valid postal code',
};

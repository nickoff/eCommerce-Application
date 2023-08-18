export const REQUIRED = 'This field is required';

export const NO_SPECIAL = 'Special characters and numbers are not allowed';

export const PASSWORD = {
  min: 'Password must be at least 8 characters long',
  number: 'Password must contain at least one digit',
  special: 'Password must contain at least one special character',
  lowerCase: 'Password must contain at least one lowercase letter',
  upperCase: 'Password must contain at least one uppercase letter',
  valid: 'Enter a valid password',
  trim: 'Password must not contain leading or trailing whitespace',
  mismatch: 'Passwords do not match',
};

export const EMAIL = {
  incorrect: 'E-mail entered incorrectly. Example: example@domain.com',
  domain: 'Email address must contain a domain name',
  trim: 'Email address must not contain leading or trailing whitespace',
  atSymbol: 'Email address must contain an "@" symbol separating local part and domain name',
  exist: 'Account with this email alraedy exist',
};

export const DATE_OF_BIRTH = {
  max: 'You must be at least 13 years old',
  typeError: 'Enter a valid date',
};

export const PHONE = 'Enter a valid phone number';

export const POSTAL_CODE = 'Enter a valid postal code';

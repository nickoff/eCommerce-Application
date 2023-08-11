export const passwordPattern = {
  min: 8,
  number: /(?=.*[0-9])/g,
  special: /(?=.*[!@#$%-&*_-])/g,
  latin: /(?=.*[a-z])/g,
  upperCase: /(?=.*[A-Z])/g,
  valid: /[0-9a-zA-Z!@#$%-&*_-]{8,}/g,
};

export const passwordMessages = {
  min: 'Password must be at least 8 characters long',
  number: 'Password must contain at least one digit (0-9)',
  special: 'Password must contain at least one special character (e.g., !@#$%-&*_-)',
  lowerCase: 'Password must contain at least one lowercase letter (a-z)',
  upperCase: 'Password must contain at least one uppercase letter (A-Z)',
  valid: 'Enter a valid password',
  trim: 'Password must not contain leading or trailing whitespace',
  mismatch: 'Passwords do not match',
  required: 'Enter password',
};

export const emailMessages = {
  required: 'Enter E-mail',
  incorrect: 'E-mail entered incorrectly. Example: example@domain.com',
  domain: 'Email address must contain a domain name',
  trim: 'Email address must not contain leading or trailing whitespace',
  atSymbol: 'Email address must contain an "@" symbol separating local part and domain name',
};

export const PASSWORD = {
  min: 8,
  number: /(?=\p{N})/gu,
  special: /(?=[\p{S}\p{P}])/gu,
  lowerCase: /(?=\p{Ll})/gu,
  upperCase: /(?=\p{Lu})/gu,
};

export const NO_SPECIAL = /^[^\p{P}\p{S}\p{N}]*$/gu;

export const DATE_OF_BIRTH = {
  max: new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
};

export const PHONE = /^(\+|8)[0-9]{9,}$/g;

export const POSTAL_CODE = /^\d{6}$/g;

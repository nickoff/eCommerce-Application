import * as yup from 'yup';
import { TFormResolver } from './enums/form-resolver.enum';
import { EMAIL_SCHEMA, PASSWORD_SCHEMA } from './constants/schemas.constant';

export const getResolver = (type: string): yup.AnySchema | undefined => {
  switch (type) {
    case TFormResolver.PASSWORD:
      return PASSWORD_SCHEMA;
    case TFormResolver.EMAIL:
      return EMAIL_SCHEMA;
    default:
      return undefined;
  }
};

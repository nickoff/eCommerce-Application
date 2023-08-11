import * as yup from 'yup';
import { TFormResolver } from './formResolver';
import { emailSchema, passwordSchema } from './validationSchemas';

export const getResolver = (type: string): yup.AnySchema | undefined => {
  switch (type) {
    case TFormResolver.PASSWORD:
      return passwordSchema;
    case TFormResolver.EMAIL:
      return emailSchema;
    default:
      return undefined;
  }
};

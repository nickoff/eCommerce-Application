import * as yup from 'yup';
import { InputName } from '@shared/enums';
import {
  COUNTRY_SCHEMA,
  DATE_OF_BIRTH_SCHEMA,
  EMAIL_SCHEMA,
  NAME_SCHEMA,
  PASSWORD_SCHEMA,
} from './constants/schemas.constant';

export const getResolver = (type: string): yup.AnySchema | undefined => {
  switch (type) {
    case InputName.Password:
      return PASSWORD_SCHEMA;
    case InputName.Email:
      return EMAIL_SCHEMA;
    case InputName.FirstName || InputName.LastName:
      return NAME_SCHEMA;
    case InputName.DateOfBirth:
      return DATE_OF_BIRTH_SCHEMA;
    case InputName.Country:
      return COUNTRY_SCHEMA;
    default:
      return undefined;
  }
};

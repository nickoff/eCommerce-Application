// Following rules are disabled so that schemas are validated in chain;

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable-next-line no-restricted-syntax */

import { ValidationError, Schema, TestConfig } from 'yup';

export default function yupSequence<T>(name: string, ...schemas: ReadonlyArray<Schema>): TestConfig<T> {
  return {
    name,
    test: async (value, context): Promise<true | ValidationError> => {
      try {
        for (const schema of schemas) {
          await schema.validate(value, { context });
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          return context.createError({ message: error.message });
        }

        throw error;
      }

      return true;
    },
  };
}

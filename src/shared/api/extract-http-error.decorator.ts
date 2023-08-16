import { HttpErrorType } from '@commercetools/sdk-client-v2';
import { isHttpErrorType } from '@shared/utils/type-guards';

export default function extractHttpError<This, Args extends unknown[], Return>(
  originalMethod: (this: This, ...args: Args) => Promise<Return>,
  _: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
) {
  return async function decorated(this: This, ...args: Args): Promise<Return | HttpErrorType> {
    try {
      const res = await originalMethod.apply(this, args);
      return res;
    } catch (error) {
      if (isHttpErrorType(error)) {
        return error;
      }

      throw error;
    }
  };
}

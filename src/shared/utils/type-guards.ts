import { HttpErrorType } from '@commercetools/sdk-client-v2';
import { IPasswordFlowError } from '@shared/interfaces';

export function isElement(value: unknown): value is Element {
  return value instanceof Element;
}

export function assertIsHTMLElement(value: unknown): asserts value is HTMLElement {
  if (!(value instanceof HTMLElement)) {
    throw new Error(`${value} is not an instance of HTMLElement`);
  }
}

export function isKeyOf<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isHttpErrorType(value: unknown): value is HttpErrorType {
  if (!(value instanceof Error)) {
    return false;
  }

  return 'code' in value && 'status' in value && 'statusCode' in value && 'originalRequest' in value;
}

export function isPasswordFlowError(value: unknown): value is IPasswordFlowError {
  if (!(value instanceof Error)) {
    return false;
  }

  return (
    'body' in value &&
    typeof value.body === 'object' &&
    !!value.body &&
    'statusCode' in value.body &&
    typeof value.body.statusCode === 'number'
  );
}

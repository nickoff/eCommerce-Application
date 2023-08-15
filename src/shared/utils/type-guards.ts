import { HttpErrorType } from '@commercetools/sdk-client-v2';

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

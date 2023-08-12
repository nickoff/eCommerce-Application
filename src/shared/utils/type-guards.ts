export function isElement(value: unknown): value is Element {
  return value instanceof Element;
}

export function assertIsHTMLElement(value: unknown): asserts value is HTMLElement {
  if (!(value instanceof HTMLElement)) {
    throw new Error(`${value} is not an instance of HTMLElement`);
  }
}

import { isElement } from './type-guards';

/**
 * NonNullable Element.querySelector()
 */
export function qs<E extends Element = HTMLElement>(
  selector: string,
  scope: Document | Element | DocumentFragment = document,
): E {
  const element = scope.querySelector<E>(selector);

  if (!element) {
    throw new Error(`Cannot find element with "${selector}" selector`);
  }

  return element;
}

export function qsAll<E extends Element = HTMLElement>(
  selector: string,
  scope: Document | Element | DocumentFragment = document,
): E[] {
  const elements = scope.querySelectorAll<E>(selector);

  if (!elements.length) {
    throw new Error(`Cannot find any element with "${selector}" selector`);
  }

  return [...elements];
}

/**
 * Employs event delegation by registering handler function
 * to listen for provided event on parent element
 */
export function delegate<T extends Element = Element>(
  parent: Element,
  selector: string,
  eventName: string,
  handler: (el: T) => void,
): void {
  parent.addEventListener(eventName, (e) => {
    e.preventDefault();

    if (!isElement(e.target)) {
      return;
    }

    const actualTarget = e.target.closest<T>(selector);

    if (actualTarget) {
      handler(actualTarget);
    }
  });
}

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

export function toggleScrollCompensate(): number {
  if (document.documentElement.hasAttribute('data-scrollbar-compensate')) {
    let text = document.documentElement.style.cssText;
    const scrollbarWidth = parseInt(text.match(/--scrollbar-compensate:(.+?);/)?.[1] ?? '', 10);
    text = text.replace(/--scrollbar-compensate:.+?;/, '');
    document.documentElement.style.cssText = text;
    document.documentElement.removeAttribute('data-scrollbar-compensate');
    return scrollbarWidth;
  }

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.cssText += `--scrollbar-compensate: ${scrollbarWidth}px;`;
  document.documentElement.setAttribute('data-scrollbar-compensate', '');
  return scrollbarWidth;
}

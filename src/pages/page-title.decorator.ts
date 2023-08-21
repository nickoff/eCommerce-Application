// A mixin class must have a constructor with a single rest parameter of type 'any[]'
/* eslint-disable @typescript-eslint/no-explicit-any */

// It's really hard to define 'decorator' function return type
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { SITE_TITLE } from '@shared/constants/seo';

type Constructor<T> = new (...args: any[]) => T;

export function PageTitle(title: string, rewrite?: boolean) {
  return function decorator<T extends Constructor<object>>(Base: T, _: ClassDecoratorContext) {
    return class extends Base {
      constructor(...args: any[]) {
        super(...args);
        document.title = rewrite ? title : `${title} | ${SITE_TITLE}`;
      }
    };
  };
}

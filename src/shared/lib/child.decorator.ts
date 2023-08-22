import { qs, qsAll } from '@shared/utils/dom-helpers';
import { Component } from './component';

export function Child(selector: string, anySelector?: boolean) {
  return function createDecorator<This extends Component, Value extends Element>(
    target: undefined,
    context: ClassFieldDecoratorContext<This, Value>,
  ): void {
    if (context.kind === 'field') {
      context.addInitializer(function select() {
        this.afterRender(() =>
          context.access.set(this, qs(anySelector ? selector : `.${selector}`, this.getContent())),
        );
      });
    } else {
      throw new Error("Target of 'Child' decorator is not a class field");
    }
  };
}

export function Children(selector: string, anySelector?: boolean) {
  return function createDecorator<This extends Component, Value extends Element[]>(
    target: undefined,
    context: ClassFieldDecoratorContext<This, Value>,
  ): void {
    if (context.kind === 'field') {
      context.addInitializer(function select() {
        this.afterRender(() =>
          context.access.set(this, qsAll(anySelector ? selector : `.${selector}`, this.getContent()) as Value),
        );
      });
    } else {
      throw new Error("Target of 'Children' decorator is not a class field");
    }
  };
}

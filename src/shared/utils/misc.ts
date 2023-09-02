import { Component } from '@shared/lib';

export function render<T extends Component>(arg: T | T[], ...components: T[]): JSX.Element[] {
  const arr = components ?? [];

  return (Array.isArray(arg) ? [...arg] : [arg])
    .concat(arr)
    .flat(Infinity)
    .map((c) => c.render());
}

export function centsToMoney(cents: number): number {
  return cents / 100;
}

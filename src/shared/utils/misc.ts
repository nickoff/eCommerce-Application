import Component from '../component';

export function render<T extends Component>(arg: T | T[], ...components: T[]): JSX.Element[] {
  const arr = components ?? [];

  return (Array.isArray(arg) ? [...arg] : [arg])
    .concat(arr)
    .flat(Infinity)
    .map((c) => c.render());
}

import Component from '@shared/component';

export interface IFormControl extends Component {
  isValid(...args: unknown[]): boolean;
}

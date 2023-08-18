import Component from '@shared/component';

export interface IFormControl extends Component {
  isValid(...args: unknown[]): Promise<boolean> | boolean;
}

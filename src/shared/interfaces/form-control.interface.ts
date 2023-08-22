import { Component } from '@shared/lib';

export interface IFormControl extends Component {
  isValid(...args: unknown[]): Promise<boolean> | boolean;
}

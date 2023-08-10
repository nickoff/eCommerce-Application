import './Input.scss';
import { element } from 'tsx-vanilla';

import Component from '@shared/component';
import { ValidateType } from '@shared/validation';

enum Styles {
  input = 'input',
}

export enum InputTypes {
  text = 'text',
  password = 'password',
  email = 'email',
}

interface IInputProps extends ICommonProps {
  type: InputTypes;
  isDisabled?: boolean;
  placeholder?: string;
  labelText?: string;
  commentTip?: string;
  isRequired?: boolean;
  isError?: boolean;
  isPassword?: boolean;
  validat?: ValidateType;
}

export class Input extends Component<IInputProps> {
  render(): JSX.Element {
    return <input type={this.props.type} className={Styles.input} />;
  }
}

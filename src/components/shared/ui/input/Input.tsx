import './Input.scss';
import { element } from 'tsx-vanilla';

import Component from '@shared/component';
import { ValidateType } from '@shared/validation';
import { passwordSchema } from '@shared/validation/validationSchemas';

enum Styles {
  input = 'input',
}

export enum InputTypes {
  text = 'text',
  password = 'password',
  email = 'email',
}

interface IInputProps extends IProps {
  type: InputTypes;
  isDisabled?: boolean;
  placeholder?: string;
  labelText?: string;
  isRequired?: boolean;
  isError?: boolean;
  isPassword?: boolean;
  validat?: ValidateType;
}

export class Input extends Component<IInputProps> {
  handleBlur = (event: Event): void => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) return;
    const isValid = passwordSchema.isValidSync({ input: event.target.value });
    if (!isValid) {
      // eslint-disable-next-line no-console
      console.log('sorry');
    }
  };

  render(): JSX.Element {
    return <input type={this.props.type} className={Styles.input} onblur={this.handleBlur} />;
  }
}

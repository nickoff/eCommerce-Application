import './Input.scss';
import { element } from 'tsx-vanilla';

import Component from '@shared/component';
import { ValidateType } from '@shared/validation';
import { passwordSchema } from '@shared/validation/validationSchemas';

enum Styles {
  input = 'input',
  input_invalid = 'input_invalid',
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
  private validSchema = passwordSchema;

  private inputValue = '';

  private errorMessage = '';

  private handleBlur = (event: Event): void => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) return;
    try {
      this.validSchema.validateSync({ input: event.target.value });
      this.props.isError = false;
    } catch (error) {
      this.errorMessage = error as string;
      this.props.isError = true;
    }
  };

  private handleInput = (event: Event): void => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) return;
    this.inputValue = event.target.value;
    this.getContent();
  };

  private handleFocus = (event: Event): void => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) return;
    if (this.props.isError) {
      event.target.nextSibling?.remove();
    }
  };

  render(): JSX.Element {
    return (
      <div className={Styles.input}>
        <p>{this.props.labelText}</p>
        <input
          className={Styles.input + (this.props.isError ? ` ${Styles.input_invalid}` : '')}
          type={this.props.type}
          onblur={this.handleBlur}
          oninput={this.handleInput}
          onfocus={this.handleFocus}
          value={this.inputValue}
        />
        {this.props.isError && <p style={{ color: 'red' }}>{this.errorMessage}</p>}
      </div>
    );
  }
}

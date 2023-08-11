import './Input.scss';
import { element } from 'tsx-vanilla';
import * as yup from 'yup';

import Component from '@shared/component';
import { ValidateType } from '@shared/validation';
import { passwordSchema } from '@shared/validation/validationSchemas';

enum Styles {
  INPUT = 'input',
  INPUT_INVALID = 'input_invalid',
  INPUT__LABEL = 'input__label',
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
      this.setProps({ isError: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        this.errorMessage = error.message;
      }

      this.setProps({ isError: true });
    }
  };

  private handleInput = (event: Event): void => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) return;
    this.inputValue = event.target.value;
  };

  private handleFocus = (event: Event): void => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) return;
    if (this.props.isError) {
      event.target.previousSibling?.childNodes[1]?.remove();
      event.target.parentElement?.classList.remove(Styles.INPUT_INVALID);
    }
  };

  render(): JSX.Element {
    return (
      <div className={Styles.INPUT + (this.props.isError ? ` ${Styles.INPUT_INVALID}` : '')}>
        <div className={Styles.INPUT__LABEL}>
          <p>{this.props.labelText}</p>
          {this.props.isError && <p>{this.errorMessage}</p>}
        </div>

        <input
          className={this.props.isError ? ` ${Styles.INPUT_INVALID}` : ''}
          type={this.props.type}
          onblur={this.handleBlur}
          oninput={this.handleInput}
          onfocus={this.handleFocus}
          value={this.inputValue}
        />
      </div>
    );
  }
}

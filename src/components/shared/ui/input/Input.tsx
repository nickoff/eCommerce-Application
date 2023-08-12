import './input.scss';
import { element } from 'tsx-vanilla';
import * as yup from 'yup';

import Component from '@shared/component';
import { getResolver } from '@shared/validation';
import { InputName } from '@shared/enums';
import { InputStyle, InputType } from './input.enum';
import { IInputProps } from './input.interface';

export class Input extends Component<IInputProps> {
  private inputValue = '';

  private errorMessage = '';

  private handleBlur = (event: Event): void => {
    const input = event.target;

    if (!input || !(input instanceof HTMLInputElement)) return;
    this.validation(input.value);
  };

  private handleInput = (event: Event): void => {
    const input = event.target;

    if (!input || !(input instanceof HTMLInputElement)) return;
    this.inputValue = input.value;
  };

  private handleFocus = (event: Event): void => {
    const input = event.target;
    const { isError } = this.props;

    if (!input || !(input instanceof HTMLInputElement)) return;
    if (isError) {
      input.previousSibling?.childNodes[1]?.remove();
      input.parentElement?.classList.remove(InputStyle.INPUT_INVALID);
    }
  };

  private validation = (value: string): void => {
    const { name } = this.props;
    const validSchema = getResolver(name);

    try {
      validSchema?.validateSync({ input: value });
      this.setProps({ isError: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        this.errorMessage = error.message;
      }

      this.setProps({ isError: true });
    }
  };

  private getType = (nameInput: string): InputType => {
    switch (nameInput) {
      case InputType.Password:
        return InputType.Password;
      case InputType.Email:
        return InputType.Email;
      case InputName.DateOfBirth:
        return InputType.Date;
      default:
        return InputType.Text;
    }
  };

  render(): JSX.Element {
    const { name, isError, labelText, placeholder, isDisabled, isRequired } = this.props;

    return (
      <div className={`${InputStyle.INPUT} ${this.props.isError ? InputStyle.INPUT_INVALID : ''}`}>
        <div className={InputStyle.INPUT__LABEL}>
          <p>{labelText}</p>
          {isError && <p>{this.errorMessage}</p>}
        </div>

        <input
          className={isError ? ` ${InputStyle.INPUT_INVALID}` : ''}
          name={name}
          type={this.getType(name)}
          onblur={this.handleBlur}
          oninput={this.handleInput}
          onfocus={this.handleFocus}
          value={this.inputValue}
          placeholder={placeholder || ''}
          disabled={isDisabled}
          required={isRequired}
        />
      </div>
    );
  }
}

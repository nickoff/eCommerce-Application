import './input.scss';
import { element } from 'tsx-vanilla';
import * as yup from 'yup';

import Component from '@shared/component';
import { getResolver } from '@shared/validation';
import { InputStyles, InputTypes } from './input.enum';
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
      input.parentElement?.classList.remove(InputStyles.INPUT_INVALID);
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

  private getType = (nameInput: string): InputTypes => {
    switch (nameInput) {
      case InputTypes.password:
        return InputTypes.password;
      case InputTypes.email:
        return InputTypes.email;
      default:
        return InputTypes.text;
    }
  };

  render(): JSX.Element {
    const { name, isError, labelText, placeholder, isDisabled, isRequired } = this.props;

    return (
      <div className={`${InputStyles.INPUT} ${this.props.isError ? InputStyles.INPUT_INVALID : ''}`}>
        <div className={InputStyles.INPUT__LABEL}>
          <p>{labelText}</p>
          {isError && <p>{this.errorMessage}</p>}
        </div>

        <input
          className={isError ? ` ${InputStyles.INPUT_INVALID}` : ''}
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

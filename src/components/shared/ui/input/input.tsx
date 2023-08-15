import { element } from 'tsx-vanilla';
import cx from 'clsx';
import * as yup from 'yup';

import Component from '@shared/component';
import { getResolver } from '@shared/validation';
import { InputName } from '@shared/enums';
import { qs } from '@shared/utils/dom-helpers';
import s from './input.module.scss';
import { InputType } from './input.enum';
import { IInputProps } from './input.interface';

export class Input extends Component<IInputProps> {
  private inputValue = '';

  private errorMessage = '';

  private input!: HTMLInputElement;

  private isAfterInputHandler = false;

  clear(): void {
    this.input.value = '';
    this.inputValue = '';
  }

  componentDidRender(): void {
    this.input = qs<HTMLInputElement>('input', this.getContent());
  }

  private handleBlur = (): void => {
    if (!this.isAfterInputHandler) {
      this.validation(this.input.value);
    }
  };

  private handleInput = (): void => {
    this.isAfterInputHandler = true;
    this.inputValue = this.input.value;
    this.validation(this.input.value);
    this.input.focus();
  };

  private handleFocus = (): void => {
    if (this.input.value) {
      return;
    }

    const { isError } = this.props;

    if (isError) {
      this.input.nextSibling?.remove();
      this.input.parentElement?.classList.remove(s.inputInvalid);
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
    } finally {
      this.isAfterInputHandler = false;
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
      <div className={cx(s.input, isError && s.inputInvalid)}>
        <div className={s.inputLabel}>
          <p>{labelText}</p>
        </div>

        <input
          className={cx(isError && s.inputInvalid)}
          name={name}
          type={this.getType(name)}
          onblur={this.handleBlur}
          oninput={this.handleInput}
          onfocus={this.handleFocus}
          value={this.inputValue}
          placeholder={placeholder || ''}
          disabled={isDisabled}
          required={isRequired}
          autocomplete={name === InputName.Country ? 'country-name' : 'off'}
        />
        {isError ? (
          <p className={s.errorMessage}>{this.errorMessage}</p>
        ) : (
          <p className={s.errorMessage}>
            <br />
          </p>
        )}
      </div>
    );
  }
}

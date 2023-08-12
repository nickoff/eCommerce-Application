import './input.scss';
import { element } from 'tsx-vanilla';
import * as yup from 'yup';

import Component from '@shared/component';
import { getResolver } from '@shared/validation/getResolver';
import { InputStyles, InputTypes } from './input.enum';
import { IInputProps } from './input.interface';

export class Input extends Component<IInputProps> {
  private validSchema = getResolver(this.props.name);

  private inputValue = '';

  private errorMessage = '';

  private handleBlur = (event: Event): void => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) return;

    this.validation(event.target.value);
  };

  private handleInput = (event: Event): void => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) return;
    this.inputValue = event.target.value;
  };

  private handleFocus = (event: Event): void => {
    if (!event.target || !(event.target instanceof HTMLInputElement)) return;
    if (this.props.isError) {
      event.target.previousSibling?.childNodes[1]?.remove();
      event.target.parentElement?.classList.remove(InputStyles.INPUT_INVALID);
    }
  };

  private validation = (value: string): void => {
    try {
      this.validSchema?.validateSync({ input: value });
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
    return (
      <div className={InputStyles.INPUT + (this.props.isError ? ` ${InputStyles.INPUT_INVALID}` : '')}>
        <div className={InputStyles.INPUT__LABEL}>
          <p>{this.props.labelText}</p>
          {this.props.isError && <p>{this.errorMessage}</p>}
        </div>

        <input
          className={this.props.isError ? ` ${InputStyles.INPUT_INVALID}` : ''}
          type={this.getType(this.props.name)}
          onblur={this.handleBlur}
          oninput={this.handleInput}
          onfocus={this.handleFocus}
          value={this.inputValue}
          placeholder={this.props.placeholder || ''}
          disabled={this.props.isDisabled}
          required={this.props.isRequired}
        />
      </div>
    );
  }
}

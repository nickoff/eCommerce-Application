import { element, ref } from 'tsx-vanilla';
import { ValidationError } from 'yup';
import { Component, Child } from '@shared/lib';
import { IFormControl } from '@shared/interfaces/form-control.interface';
import { InputType } from '@shared/enums';
import { COMPONENT_ROOT_ATTR, COMPONENT_CHILD_ATTR } from '@shared/constants/misc';
import * as s from './input.module.scss';
import { IInputProps } from './input.interface';
import VisibilityToggle from './visibility-toggle/visibility-toggle';

export class Input extends Component<IInputProps> implements IFormControl {
  private hasError = false;

  @Child(s.errorMsg) private errorPara!: HTMLParagraphElement;

  @Child(s.inputEl) input!: HTMLInputElement;

  getValue(): string {
    return this.input.value;
  }

  clear(): void {
    this.input.value = '';
  }

  async isValid(): Promise<boolean> {
    await this.validate();
    return !this.hasError;
  }

  render(): JSX.Element {
    this.hasError = false;

    const { name, label, type, placeholder, disabled, required, withVisibilityToggle, value } = this.props;

    const inputRef = ref<HTMLInputElement>();

    return (
      <div className={s.input} attributes={{ [COMPONENT_ROOT_ATTR]: '' }}>
        <span className={s.inputLabel}>{label}</span>

        <div className={s.inputWrapper}>
          <input
            className={s.inputEl}
            name={name}
            type={type ?? InputType.Text}
            oninput={this.validate.bind(this)}
            placeholder={placeholder ?? ''}
            disabled={disabled}
            required={required}
            attributes={{ [COMPONENT_CHILD_ATTR]: '' }}
            value={value || ''}
            ref={inputRef}
          />
          {withVisibilityToggle &&
            inputRef.value &&
            new VisibilityToggle({ input: inputRef.value, className: s.visToggle }).render()}
        </div>

        <p className={s.errorMsg}></p>
      </div>
    );
  }

  private async validate(): Promise<void> {
    const { validationSchema, required, disabled, additionalValidationContext } = this.props;

    if (disabled || !validationSchema) {
      return;
    }

    const { value } = this.input;

    if (!value && !required) {
      if (this.hasError) this.removeError();
      return;
    }

    const schemas = Array.isArray(validationSchema) ? validationSchema : [validationSchema];

    try {
      // Validation should be done sequentially, that's why following rules are disabled
      // eslint-disable-next-line no-restricted-syntax
      for (const schema of schemas) {
        // eslint-disable-next-line no-await-in-loop
        await schema.validate(value, { context: { required, ...additionalValidationContext } });
        if (this.hasError) this.removeError();
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        this.showError(error.message);
      } else {
        throw error;
      }
    }
  }

  private removeError(): void {
    this.hasError = false;
    this.errorPara.textContent = '';
    this.element.classList.remove(s.inputInvalid);
    this.input.classList.remove(s.inputInvalid);
  }

  private showError(msg: string): void {
    this.hasError = true;
    this.errorPara.textContent = msg;
    this.element.classList.add(s.inputInvalid);
    this.input.classList.add(s.inputInvalid);
  }
}

import { element } from 'tsx-vanilla';
import { ValidationError } from 'yup';
import Component from '@shared/component';
import { qs } from '@shared/utils/dom-helpers';
import { IFormControl } from '@shared/interfaces/form-control.interface';
import { InputType } from '@shared/enums';
import { COMPONENT_ROOT_ATTR, COMPONENT_CHILD_ATTR } from '@shared/constants/misc';
import * as s from './input.module.scss';
import { IInputProps } from './input.interface';

export class Input extends Component<IInputProps> implements IFormControl {
  input!: HTMLInputElement;

  private errorPara: HTMLParagraphElement;

  private hasError = false;

  constructor(...args: IInputProps[]) {
    super(...args);

    this.errorPara = document.createElement('p');
    this.errorPara.classList.add(s.errorMessage);
  }

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

  protected componentDidRender(): void {
    this.input = qs('input', this.getContent());
  }

  render(): JSX.Element {
    const { name, label, type, placeholder, disabled, required } = this.props;

    return (
      <div className={s.input} attributes={{ [COMPONENT_ROOT_ATTR]: '' }}>
        <span className={s.inputLabel}>{label}</span>

        <input
          name={name}
          type={type ?? InputType.Text}
          oninput={this.validate.bind(this)}
          placeholder={placeholder ?? ''}
          disabled={disabled}
          required={required}
          attributes={{ [COMPONENT_CHILD_ATTR]: '' }}
        />
        {this.errorPara}
      </div>
    );
  }

  private async validate(): Promise<void> {
    const { validationSchema: schema, required, disabled, additionalValidationContext } = this.props;

    if (disabled || !schema) {
      return;
    }

    const { value } = this.input;

    if (!value && !required) {
      if (this.hasError) this.removeError();
      return;
    }

    try {
      await schema.validate(value, { context: { required, ...additionalValidationContext } });
      if (this.hasError) this.removeError();
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

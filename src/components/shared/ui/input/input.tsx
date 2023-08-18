import { element } from 'tsx-vanilla';
import { ValidationError } from 'yup';
import Component from '@shared/component';
import { qs } from '@shared/utils/dom-helpers';
import { IFormControl } from '@shared/interfaces/form-control.interface';
import { InputType } from '@shared/enums';
import s from './input.module.scss';
import { IInputProps } from './input.interface';

export class Input extends Component<IInputProps> implements IFormControl {
  private input!: HTMLInputElement;

  private errorPara: HTMLParagraphElement;

  private hasError = false;

  constructor(...args: IInputProps[]) {
    super(...args);

    this.errorPara = document.createElement('p');
    this.errorPara.classList.add(s.errorMessage);
  }

  clear(): void {
    this.input.value = '';
  }

  async isValid(): Promise<boolean> {
    await this.validate();
    return this.hasError;
  }

  componentDidRender(): void {
    this.input = qs('input', this.getContent());
  }

  render(): JSX.Element {
    const { name, label, type, placeholder, disabled, required } = this.props;

    return (
      <div className={s.input}>
        <span className={s.inputLabel}>{label}</span>

        <input
          name={name}
          type={type ?? InputType.Text}
          oninput={this.validate.bind(this)}
          placeholder={placeholder ?? ''}
          disabled={disabled}
          required={required}
        />
        {this.errorPara}
      </div>
    );
  }

  private async validate(): Promise<void> {
    const { validationSchema: schema, required } = this.props;
    const { value } = this.input;

    if (!schema) {
      return;
    }

    if (!value && !required) {
      if (this.hasError) this.removeError();
      return;
    }

    try {
      await schema.validate(value, { context: { required } });
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

import { element } from 'tsx-vanilla';
import { Child, Children, Component } from '@shared/lib';
import { COMPONENT_ROOT_ATTR, COMPONENT_CHILD_ATTR } from '@shared/constants/misc';
import { IFormControl } from '@shared/interfaces/form-control.interface';
import * as s from './select.module.scss';
import { type ISelectProps } from './select.interface';

class Select extends Component<ISelectProps> implements IFormControl {
  @Child(s.selectEl) private select!: HTMLSelectElement;

  @Child(s.errorMsg) private errorPara!: HTMLParagraphElement;

  @Children(s.optionEl) private options!: HTMLOptionElement[];

  clear(): void {
    this.options.forEach((opt) => {
      const option = opt;
      option.selected = false;
    });
  }

  isValid(): boolean {
    const { required, disabled } = this.props;

    if (!required || disabled) {
      return true;
    }

    this.toggleRequiredError();
    return this.isValueSelected();
  }

  render(): JSX.Element {
    const { name, options, required, disabled, selectedOption, labelText } = this.props;

    return (
      <div className={s.select} attributes={{ [COMPONENT_ROOT_ATTR]: '' }}>
        <span className={s.selectLabel}>{labelText}</span>
        <select
          className={s.selectEl}
          name={name}
          required={required}
          disabled={disabled}
          onblur={this.toggleRequiredError.bind(this)}
          onchange={this.toggleRequiredError.bind(this)}
          attributes={{ [COMPONENT_CHILD_ATTR]: '' }}
        >
          {options.map((opt, index) => (
            <option
              className={s.optionEl}
              value={opt.value}
              selected={selectedOption === index}
              disabled={opt.disabled}
            >
              {opt.content}
            </option>
          ))}
        </select>
        <p className={s.errorMsg}></p>
      </div>
    );
  }

  private toggleRequiredError(): void {
    if (!this.props.required) {
      return;
    }

    if (this.isValueSelected()) {
      this.errorPara.textContent = '';
      this.element.classList.remove(s.selectInvalid);
    } else {
      this.errorPara.textContent = 'This field is required';
      this.element.classList.add(s.selectInvalid);
    }
  }

  private isValueSelected(): boolean {
    if (this.select.options.item(0)?.value !== '') return true;
    return this.select.selectedIndex !== 0;
  }
}

export default Select;

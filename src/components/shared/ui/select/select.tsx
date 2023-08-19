import { element } from 'tsx-vanilla';
import cx from 'clsx';
import Component from '@shared/component';
import { qs } from '@shared/utils/dom-helpers';
import { COMPONENT_ROOT_ATTR, COMPONENT_CHILD_ATTR } from '@shared/constants/misc';
import { IFormControl } from '@shared/interfaces/form-control.interface';
import s from './select.module.scss';
import { type ISelectProps } from './select.interface';

class Select extends Component<ISelectProps> implements IFormControl {
  private select!: HTMLSelectElement;

  private options!: HTMLOptionElement[];

  private errorPara!: HTMLParagraphElement;

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

  componentDidRender(): void {
    this.select = qs('select', this.getContent());
    this.options = [...this.select.options];
    this.errorPara = qs('p', this.getContent());
  }

  render(): JSX.Element {
    const { name, options, required, disabled, className, selectedOption, labelText } = this.props;

    return (
      <div className={cx(s.select, className)} attributes={{ [COMPONENT_ROOT_ATTR]: '' }}>
        <span className={s.selectLabel}>{labelText}</span>
        <select
          name={name}
          required={required}
          disabled={disabled}
          onblur={this.toggleRequiredError.bind(this)}
          onchange={this.toggleRequiredError.bind(this)}
          attributes={{ [COMPONENT_CHILD_ATTR]: '' }}
        >
          {options.map((opt, index) => (
            <option value={opt.value} selected={selectedOption === index} disabled={opt.disabled}>
              {opt.content}
            </option>
          ))}
        </select>
        <p className={s.errorMessage}></p>
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
    return this.select.selectedIndex !== 0;
  }
}

export default Select;

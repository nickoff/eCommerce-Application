import { element } from 'tsx-vanilla';
import cx from 'clsx';
import Component from '@shared/component';
import { qs } from '@shared/utils/dom-helpers';
import s from './select.module.scss';
import { type ISelectProps } from './select.interface';

class Select extends Component<ISelectProps> {
  private select!: HTMLSelectElement;

  private options!: HTMLOptionElement[];

  private errorPara!: HTMLParagraphElement;

  clear(): void {
    this.options.forEach((opt) => {
      const option = opt;
      option.selected = false;
    });
  }

  componentDidRender(): void {
    this.select = qs('select', this.getContent());
    this.options = [...this.select.options];
    this.errorPara = qs('p', this.getContent());
  }

  render(): JSX.Element {
    const { name, options, isRequired, isDisabled, className, selectedOption, labelText } = this.props;

    return (
      <div className={cx(s.select, className)}>
        <span className={s.selectLabel}>{labelText}</span>
        <select
          name={name}
          required={isRequired}
          disabled={isDisabled}
          onblur={(): boolean => this.toggleRequiredError()}
          onchange={(): boolean => this.toggleRequiredError()}
        >
          {options.map((opt, index) => (
            <option value={opt.value} selected={selectedOption === index} disabled={opt.isDisabled}>
              {opt.content}
            </option>
          ))}
        </select>
        <p className={s.errorMessage}></p>
      </div>
    );
  }

  toggleRequiredError(): boolean {
    if (this.props.isRequired) {
      if (this.options.some((opt) => opt.selected && !opt.disabled)) {
        this.errorPara.textContent = '';
        this.element.classList.remove(s.selectInvalid);
        return true;
      }
      this.errorPara.textContent = 'This field is required';
      this.element.classList.add(s.selectInvalid);
      return false;
    }
    return false;
  }
}

export default Select;

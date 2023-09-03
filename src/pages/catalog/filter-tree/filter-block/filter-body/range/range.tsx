import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import 'range-slider-input/dist/style.css';
import rangeSlider, { RangeSlider, RangeSliderConfig } from 'range-slider-input';
import { qs } from '@shared/utils/dom-helpers';
import { padDot } from '@shared/utils/misc';
import { IRangeFilter } from '@shared/interfaces';
import { IFilterBodyProps, IFilterBody } from '../filter-body.interface';
import * as s from './range.module.scss';
import { FilterBlockEvent, RangeChangeEvent, FilterBlockType, IFilterPayload } from '../../filter-block.types';

class FilterBodyRange extends Component<IFilterBodyProps<IRangeFilter>> implements IFilterBody {
  private lowerInput!: HTMLInputElement;

  private upperInput!: HTMLInputElement;

  private range!: RangeSlider;

  protected componentDidRender(): void {
    this.configurePriceInputs();
    this.configureRangeSlider();
  }

  unselect(payload: IFilterPayload<IRangeFilter>): void {
    const newPayload = payload;
    newPayload.status = false;

    this.getContent().dispatchEvent(
      new CustomEvent<RangeChangeEvent>(FilterBlockEvent.FilterChange, {
        detail: { type: FilterBlockType.Range, payload: newPayload },
        bubbles: true,
      }),
    );
  }

  render(): JSX.Element {
    const {
      filterData: { min, max },
    } = this.props;

    return (
      <div>
        <div className={s.rangeInputWrapper}>
          <input className={s.rangeInput} type="number" value={min} min={min} max={max} dataset={{ bound: 'lower' }} />
          -
          <input className={s.rangeInput} type="number" value={max} min={min} max={max} dataset={{ bound: 'upper' }} />
        </div>
        <div className={s.rangeSlider}></div>
      </div>
    );
  }

  private notifyFilterChange(min: number, max: number): void {
    const { filterBlock } = this.props;
    this.getContent().dispatchEvent(
      new CustomEvent<RangeChangeEvent>(FilterBlockEvent.FilterChange, {
        detail: {
          type: FilterBlockType.Range,
          payload: {
            filter: { min, max },
            status: true,
            filterLabel: `$${min} - $${max}`,
            filterBlock,
            filterBody: this,
          },
        },
      }),
    );
  }

  private configurePriceInputs(): void {
    const {
      filterData: { min, max },
    } = this.props;

    this.lowerInput = qs('[data-bound="lower"]', this.getContent());
    this.upperInput = qs('[data-bound="upper"]', this.getContent());

    [this.lowerInput, this.upperInput].forEach((input) => {
      input.addEventListener('change', (e: Event) => {
        const [lower, upper] = this.range.value();

        let inputValue = +input.value;

        if (inputValue < min) {
          inputValue = min;
        } else if (inputValue > max) {
          inputValue = max;
        }

        let finalValue: [number, number];

        if (input === this.lowerInput) {
          finalValue = [inputValue, upper];
        } else {
          finalValue = [lower, inputValue];
        }

        this.range.value(finalValue);

        if (e.isTrusted) {
          this.notifyFilterChange(lower, upper);
        }
      });
    });
  }

  private configureRangeSlider(): void {
    const {
      filterData: { min, max },
    } = this.props;

    const sliderConfig: RangeSliderConfig = {
      min,
      max,
      value: [min, max],
      step: 1,
      rangeSlideDisabled: true,
      onInput: (value) => {
        const [lower, upper] = value;
        this.lowerInput.value = lower.toString();
        this.upperInput.value = upper.toString();
      },
      onThumbDragEnd: () => {
        this.notifyFilterChange(...this.range.value());
      },
    };

    setTimeout(() => {
      const rangeEl = qs(padDot(s.rangeSlider), this.getContent());
      this.range = rangeSlider(rangeEl, sliderConfig);
    });
  }
}

export default FilterBodyRange;

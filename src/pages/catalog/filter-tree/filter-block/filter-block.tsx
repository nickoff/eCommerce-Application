import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Child, Component } from '@shared/lib';
import NeverError from '@shared/types/never-error';
import ProductListService from '@shared/api/product/product-list.service';
import Store from '@app/store/store';
import { assertIsHTMLElement, isHttpErrorType } from '@shared/utils/type-guards';
import { AttributePlainEnumValue } from '@commercetools/platform-sdk';
import { ProductFilterType, ProductTypeKey } from '@shared/enums';
import { delegate, qs } from '@shared/utils/dom-helpers';
import { MouseEvtName } from '@shared/constants/events';
import rangeSlider, { RangeSlider, RangeSliderConfig } from 'range-slider-input';
import 'range-slider-input/dist/style.css';
import * as s from './filter-block.module.scss';
import { IFilterBlockProps } from './filter-block.interface';
import { FilterBlockEvent } from './filter-block.enum';

class FilterBlock extends Component<IFilterBlockProps> {
  @Child(s.accordionBody) private filterBody!: HTMLElement;

  private lowerPriceInput!: HTMLInputElement;

  private upperPriceInput!: HTMLInputElement;

  private filterData: AttributePlainEnumValue[] | null = null;

  private priceRange!: RangeSlider;

  protected componentDidRender(): void {
    if (this.props.filterType !== ProductFilterType.Price) {
      delegate(this.filterBody, '[data-filter-type]', MouseEvtName.CLICK, this.onFilterClick.bind(this));
    } else {
      this.configurePriceInputs();
      this.configureRangeSlider();
    }
  }

  private configurePriceInputs(): void {
    this.lowerPriceInput = qs('[data-bound="lower"]', this.getContent());
    this.upperPriceInput = qs('[data-bound="upper"]', this.getContent());

    [this.lowerPriceInput, this.upperPriceInput].forEach((input) => {
      input.addEventListener('change', (e: Event) => {
        const [lower, upper] = this.priceRange.value();

        let inputValue = +input.value;

        if (inputValue < 0) {
          inputValue = 0;
        } else if (inputValue > 1000) {
          inputValue = 1000;
        }

        let finalValue: [number, number];

        if (input === this.lowerPriceInput) {
          finalValue = [inputValue, upper];
        } else {
          finalValue = [lower, inputValue];
        }

        this.priceRange.value(finalValue);

        if (e.isTrusted) {
          this.notifyPriceFilterChange(lower, upper);
        }
      });
    });
  }

  private configureRangeSlider(): void {
    const sliderConfig: RangeSliderConfig = {
      min: 0,
      max: 1000,
      value: [0, 1000],
      step: 1,
      rangeSlideDisabled: true,
      onInput: (value) => {
        const [lower, upper] = value;
        this.lowerPriceInput.value = lower.toString();
        this.upperPriceInput.value = upper.toString();

        // if (!userInteraction) {
        //   this.notifyPriceFilterChange(lower, upper);
        // }
      },
      onThumbDragEnd: () => {
        this.notifyPriceFilterChange(...this.priceRange.value());
      },
    };

    setTimeout(() => {
      const rangeEl = qs(`.${s.rangeSlider}`, this.getContent());
      this.priceRange = rangeSlider(rangeEl, sliderConfig);
    });
  }

  unselectFilter(key: string): void {
    if (key === 'price') {
      this.lowerPriceInput.value = '0';
      this.upperPriceInput.value = '1000';
      this.priceRange.value([0, 1000]);
    } else {
      qs(`[data-filter-key="${key}"]`, this.getContent()).classList.remove(s.filterBtnSelected);
    }
  }

  render(): JSX.Element {
    if (!this.filterData) this.load();
    const collapseId = `collapse_${Math.random().toFixed(4)}`;

    return (
      <div className={cx('accordion-item', s.accordionItem)}>
        <h4 className="accordion-header">
          <button
            className={cx('accordion-button', s.accordionBtn)}
            type="button"
            dataset={{ bsToggle: 'collapse', bsTarget: `#${collapseId}` }}
          >
            {this.props.filterType}
          </button>
        </h4>
        <div id={collapseId} className="accordion-collapse collapse show">
          <div className={cx('accordion-body', s.accordionBody)}>
            {this.props.filterType === ProductFilterType.Price
              ? this.renderPriceRange()
              : this.filterData && this.renderContent(this.filterData)}
          </div>
        </div>
      </div>
    );
  }

  private onFilterClick(target: Element): void {
    assertIsHTMLElement(target);
    const status = this.toggleFilterSelect(target);

    const { filterType, filterKey, filterLabel } = target.dataset;

    if (filterType && filterKey && filterLabel) {
      this.notifyFilterChange(filterType, filterKey, filterLabel, status);
    }
  }

  private toggleFilterSelect(filterEl: HTMLElement): boolean {
    return filterEl.classList.toggle(s.filterBtnSelected);
  }

  private notifyPriceFilterChange(from: number, to: number): void {
    this.getContent().dispatchEvent(
      new CustomEvent(FilterBlockEvent.PriceChange, {
        detail: { from, to },
        bubbles: true,
      }),
    );
  }

  private notifyFilterChange(type: string, key: string, label: string, status: boolean): void {
    this.getContent().dispatchEvent(
      new CustomEvent(FilterBlockEvent.FilterChange, {
        detail: { filter: { type, key, label, status } },
        bubbles: true,
      }),
    );
  }

  private renderContent(filterData: AttributePlainEnumValue[]): JSX.Element {
    const { filterType } = this.props;

    switch (filterType) {
      case ProductFilterType.Vendor:
        return this.renderFilterList(filterData);
      case ProductFilterType.Color:
        return this.renderColorPallete(filterData);
      case ProductFilterType.Price:
        return this.renderPriceRange();
      default:
        throw new NeverError(filterType);
    }
  }

  private async load(): Promise<void> {
    const { apiRoot } = Store;
    const { category, filterType } = this.props;

    if (filterType === ProductFilterType.Price) {
      return;
    }

    const result = await ProductListService.getAttributeOfProductType(apiRoot, filterType, ProductTypeKey[category]);

    if (!isHttpErrorType(result)) {
      this.filterData = result;
      this.render();
    }
  }

  private renderFilterList(filterData: AttributePlainEnumValue[]): JSX.Element {
    return <ul className={s.filterList}>{filterData.map((v) => this.renderFilterItem(v))}</ul>;
  }

  private renderFilterItem({ key, label }: AttributePlainEnumValue): JSX.Element {
    const { filterType } = this.props;

    return (
      <li className={s.filterItem}>
        <button className={s.filterBtn} dataset={{ filterType, filterKey: key, filterLabel: label }}>
          <span className={s.filterCheckbox}></span>
          <span className={s.filterName}>{label}</span>
        </button>
      </li>
    );
  }

  private renderColorPallete(filterData: AttributePlainEnumValue[]): JSX.Element {
    const { filterType } = this.props;

    return (
      <ul className={s.colorList}>
        {filterData.map((data) => (
          <li className={s.colorItem} style={{ backgroundColor: data.key }}>
            <button dataset={{ filterType, filterKey: data.key, filterLabel: data.label }}></button>
          </li>
        ))}
      </ul>
    );
  }

  private renderPriceRange(): JSX.Element {
    return (
      <div>
        <div className={s.priceRangeInputWrapper}>
          <input
            className={s.priceRangeInput}
            type="number"
            value={0}
            min={0}
            max={1000}
            dataset={{ bound: 'lower' }}
          />
          -
          <input
            className={s.priceRangeInput}
            type="number"
            value={1000}
            min={0}
            max={1000}
            dataset={{ bound: 'upper' }}
          />
        </div>
        <div className={s.rangeSlider}></div>
      </div>
    );
  }
}

export default FilterBlock;

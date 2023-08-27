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
import * as s from './filter-block.module.scss';
import { IFilterBlockProps } from './filter-block.interface';
import { FilterBlockEvent } from './filter-block.enum';

class FilterBlock extends Component<IFilterBlockProps> {
  @Child(s.accordionBody) private filterBody!: HTMLElement;

  private filterData: AttributePlainEnumValue[] | null = null;

  protected componentDidRender(): void {
    delegate(this.filterBody, '[data-filter-type]', MouseEvtName.CLICK, this.onFilterClick.bind(this));
  }

  unselectFilter(key: string): void {
    qs(`[data-filter-key="${key}"]`, this.getContent()).classList.remove(s.filterBtnSelected);
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
            {this.filterData && this.renderContent(this.filterData)}
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
      default:
        throw new NeverError(filterType);
    }
  }

  private async load(): Promise<void> {
    const { apiRoot } = Store;
    const { category, filterType } = this.props;

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
}

export default FilterBlock;

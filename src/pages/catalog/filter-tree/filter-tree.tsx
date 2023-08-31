import { element } from 'tsx-vanilla';
import { Child, Component } from '@shared/lib';
import { ProductFilterType } from '@shared/enums';
import { render } from '@shared/utils/misc';
import cx from 'clsx';
import CrossIcon from '@assets/icons/cross-icon.element.svg';
import { capitalize } from 'lodash';
import { IFilterBy } from '@shared/interfaces';
import { delegate, qs } from '@shared/utils/dom-helpers';
import { MouseEvtName } from '@shared/constants/events';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import * as s from './filter-tree.module.scss';
import FilterBlock from './filter-block/filter-block';
import { IFilterTreeProps } from './filter-tree.interface';
import { FilterBlockEvent } from './filter-block/filter-block.enum';
import { IFilterChangeEvtPayload, IPriceChangeEvtPayload } from './filter-block/filter-block.interface';

class FilterTree extends Component<IFilterTreeProps> {
  @Child(s.appliedFilters) private appliedFilters!: HTMLElement;

  @Child(s.appliedFiltersList) private appliedFiltersList!: HTMLElement;

  private filterBlocks = [
    new FilterBlock({ filterType: ProductFilterType.Vendor, category: this.props.category }),
    new FilterBlock({ filterType: ProductFilterType.Color, category: this.props.category }),
    new FilterBlock({ filterType: ProductFilterType.Price, category: this.props.category }),
  ];

  private filter: IFilterBy = {
    category: this.props.category,
    vendor: [],
    color: [],
  };

  constructor(props: IFilterTreeProps) {
    super(props);

    this.filter = new Proxy(this.filter, {
      set: (target, property, value): boolean => {
        Reflect.set(target, property, value);
        this.props.onFilterChange(this.filter);
        return true;
      },
    });
  }

  private proxifyFilter(): void {
    this.filter = new Proxy(this.filter, {
      set: (target, property, value): boolean => {
        Reflect.set(target, property, value);
        this.props.onFilterChange(this.filter);
        return true;
      },
    });
  }

  protected componentDidRender(): void {
    this.getContent().addEventListener(FilterBlockEvent.FilterChange, ({ detail }) =>
      this.onFilterChange(detail.filter),
    );

    this.getContent().addEventListener(FilterBlockEvent.PriceChange, ({ detail }) => {
      this.onPriceFilterChange(detail);
    });

    delegate(this.appliedFilters, `.${s.removeFilterBtn}`, MouseEvtName.CLICK, (target) => {
      assertIsHTMLElement(target);
      const { type, key } = target.dataset;

      if (type && key) {
        this.removeFilter(type as ProductFilterType, key);
      }
    });
  }

  render(): JSX.Element {
    return (
      <div className={s.filterContainer}>
        <h3 className={s.filterHeading}>Filters</h3>
        <div className={cx(s.appliedFilters, 'd-none')}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <p className="m-0">Refined by</p>
            <button className={s.clearAllBtn} onclick={this.resetFilters.bind(this)}>
              Clear all
            </button>
          </div>
          <ul className={s.appliedFiltersList}></ul>
        </div>
        <div className={cx('accordion', s.filterBlocksContainer)}>{render(this.filterBlocks)}</div>
      </div>
    );
  }

  private onFilterChange(filterData: IFilterChangeEvtPayload): void {
    if (filterData.status) {
      this.addFilter(filterData);
    } else {
      this.removeFilter(filterData.type, filterData.key);
    }
  }

  private onPriceFilterChange(payload: IPriceChangeEvtPayload): void {
    this.filter.price = payload;

    this.appliedFilters.classList.remove('d-none');

    const label = `${payload.from} - ${payload.to}`;

    const newFilterItem = this.renderAppliedFilterItem({ type: ProductFilterType.Price, label, key: 'price' });

    const existingFilterItem = this.appliedFiltersList
      .querySelector(`[data-type="${ProductFilterType.Price}"]`)
      ?.closest(`.${s.appliedFilter}`);

    if (existingFilterItem) {
      existingFilterItem.replaceWith(newFilterItem);
    } else {
      this.appliedFiltersList.append(newFilterItem);
    }
  }

  private resetFilters(): void {
    const filterItems = [...this.appliedFiltersList.children];

    filterItems.forEach((item) => {
      const { type, key } = qs(`.${s.removeFilterBtn}`, item).dataset;

      if (type && key) {
        this.removeFilter(type as ProductFilterType, key, false);
      }
    });

    this.filter = { category: this.props.category, vendor: [], color: [] };
    this.props.onFilterChange(this.filter);
    this.proxifyFilter();
  }

  private addFilter({ type, key, label }: IFilterChangeEvtPayload): void {
    if (type !== ProductFilterType.Price) {
      this.filter[type] = this.filter[type]?.concat(key);
    }

    this.appliedFilters.classList.remove('d-none');
    this.appliedFiltersList.append(this.renderAppliedFilterItem({ type, label, key }));
  }

  private removeFilter(type: ProductFilterType, key: string, shouldUpdate = true): void {
    if (shouldUpdate) {
      if (type !== ProductFilterType.Price) {
        this.filter[type] = this.filter[type]?.filter((filterKey) => filterKey !== key);
      } else {
        this.filter[type] = { from: 0, to: 1000 };
      }
    }

    qs(`[data-type="${type}"][data-key="${key}"]`, this.appliedFiltersList).closest(`.${s.appliedFilter}`)?.remove();

    if (!this.appliedFiltersList.children.length) {
      this.appliedFilters.classList.add('d-none');
    }

    const filterBlock = this.filterBlocks.find((block) => block.getState().filterType === type);

    if (filterBlock) {
      filterBlock.unselectFilter(key);
    }
  }

  private renderAppliedFilterItem({ type, key, label }: Omit<IFilterChangeEvtPayload, 'status'>): JSX.Element {
    return (
      <li className={s.appliedFilter}>
        <div>
          <span>{capitalize(type)}</span>: <span className="fw-bold">{label}</span>
        </div>
        <button className={s.removeFilterBtn} dataset={{ type, key }}>
          {CrossIcon.cloneNode(true)}
        </button>
      </li>
    );
  }
}

export default FilterTree;

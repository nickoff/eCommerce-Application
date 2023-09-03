import { element } from 'tsx-vanilla';
import { Child, Component } from '@shared/lib';
import { render, padDot } from '@shared/utils/misc';
import cx from 'clsx';
import CrossIcon from '@assets/icons/cross-icon.element.svg';
import { capitalize } from 'lodash';
import { FilterName } from '@shared/enums';
import { BiMap } from '@jsdsl/bimap';
import { delegate } from '@shared/utils/dom-helpers';
import { MouseEvtName } from '@shared/constants/events';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import { IRangeFilter } from '@shared/interfaces';
import { Category } from '@commercetools/platform-sdk';
import * as s from './filter-tree.module.scss';
import { IFilterTreeProps } from './filter-tree.interface';
import {
  FilterBlockEvent,
  FilterBlockType,
  IFilterPayload,
  FilterChangeEvent,
  FilterData,
} from './filter-block/filter-block.types';
import FilterBlock from './filter-block/filter-block';

class FilterTree extends Component<IFilterTreeProps> {
  @Child(s.appliedFilters) private appliedFilters!: HTMLElement;

  @Child(s.appliedFiltersList) private appliedFiltersList!: HTMLElement;

  private filterBlocks: FilterBlock[];

  private mapPayload = new BiMap<JSX.Element, IFilterPayload<FilterData>>();

  private mapElement = new BiMap<string, JSX.Element>();

  constructor(props: IFilterTreeProps) {
    super(props);

    const { filters } = props;
    const { vendors, colors, priceRange } = filters;

    this.filterBlocks = [
      new FilterBlock({
        type: FilterBlockType.List,
        filterName: FilterName.Vendor,
        filterData: vendors,
        heading: 'Vendor',
      }),
      new FilterBlock({
        type: FilterBlockType.Pallete,
        filterName: FilterName.Color,
        filterData: colors,
        heading: 'Color',
      }),
      new FilterBlock({
        type: FilterBlockType.Range,
        filterName: FilterName.PriceRange,
        filterData: priceRange,
        heading: 'Price',
      }),
    ];
  }

  protected componentDidRender(): void {
    this.getContent().addEventListener(FilterBlockEvent.FilterChange, ({ detail }) =>
      this.updateAppliedFilters(detail),
    );

    delegate(this.appliedFiltersList, padDot(s.removeFilterBtn), MouseEvtName.CLICK, (target) => {
      const filterItem = target.closest('li');
      assertIsHTMLElement(filterItem);
      const savedPayload = this.mapPayload.get(filterItem);

      if (savedPayload) {
        const { filterBody } = savedPayload;
        filterBody.unselect(savedPayload as IFilterPayload<string & Category & IRangeFilter>);
      }
    });
  }

  // updateFilters(filters: IFilters) {

  // }

  render(): JSX.Element {
    return (
      <div className={s.filterContainer}>
        <h3 className={s.filterHeading}>Filters</h3>
        <div className={cx(s.appliedFilters, 'd-none')}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <p className="m-0">Refined by</p>
            <button className={s.clearAllBtn}>Clear all</button>
          </div>
          <ul className={s.appliedFiltersList}></ul>
        </div>
        <div className={cx('accordion', s.filterBlocksContainer)}>{render(this.filterBlocks)}</div>
      </div>
    );
  }

  private updateAppliedFilters(event: FilterChangeEvent): void {
    if (event.type === FilterBlockType.Range) {
      this.updateRangeFilter(event.payload);
    } else {
      this.updateFilter(event.payload);
    }

    this.toggleFilterListVisibility();
  }

  private toggleFilterListVisibility(): void {
    if (this.appliedFiltersList.children) {
      this.appliedFilters.classList.remove('d-none');
    } else {
      this.appliedFilters.classList.add('d-none');
    }
  }

  private updateFilter(payload: IFilterPayload<FilterData>): void {
    const { filterLabel } = payload;

    if (payload.status) {
      const filterItem = this.renderAppliedFilterItem(payload);
      this.appliedFiltersList.append(filterItem);

      this.mapElement.set(filterLabel, filterItem);
      this.mapPayload.set(filterItem, payload);
    } else {
      const elem = this.mapElement.get(filterLabel);
      elem?.remove();
      this.mapElement.removeByKey(filterLabel);
      if (elem) this.mapPayload.removeByKey(elem);
    }
  }

  private updateRangeFilter(payload: IFilterPayload<FilterData>): void {
    const { filterName } = payload.filterBlock.getState();
    const existingRangeFilterItem = this.mapElement.get(filterName);

    if (existingRangeFilterItem) {
      const newFilterItem = this.renderAppliedFilterItem(payload);
      existingRangeFilterItem.replaceWith(newFilterItem);
      this.mapElement.set(filterName, newFilterItem);
      this.mapPayload.set(newFilterItem, payload);
    } else {
      const filterItem = this.renderAppliedFilterItem(payload);
      this.appliedFiltersList.append(filterItem);
      this.mapElement.set(filterName, filterItem);
      this.mapPayload.set(filterItem, payload);
    }
  }

  private renderAppliedFilterItem({
    filterLabel,
    filterBlock,
  }: Pick<IFilterPayload, 'filterLabel' | 'filterBlock'>): JSX.Element {
    return (
      <li className={s.appliedFilter}>
        <div>
          <span>{capitalize(filterBlock.getState().heading)}</span>: <span className="fw-bold">{filterLabel}</span>
        </div>
        <button className={s.removeFilterBtn}>{CrossIcon.cloneNode(true)}</button>
      </li>
    );
  }
}

export default FilterTree;

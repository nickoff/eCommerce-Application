/* eslint-disable max-lines-per-function */
import { element, fragment } from 'tsx-vanilla';
import cx from 'clsx';
import { Component, Child } from '@shared/lib';
import { delegate } from '@shared/utils/dom-helpers';
import { MouseEvtName } from '@shared/constants/events';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import { SortType, SortDirection } from '@shared/enums';
import { ISortBy } from '@shared/interfaces';
import Backdrop from '@components/shared/ui/backdrop/backdrop';
import CrossIcon from '@assets/icons/cross-icon.element.svg';
import * as s from './toolbar.module.scss';
import GridIcon from './assets/grid-icon.element.svg';
import ListIcon from './assets/list-icon.element.svg';
import FilterIcon from './assets/filter-icon.element.svg';
import { CardsLayout, ToolbarEvent } from './toolbar.enum';

class Toolbar extends Component {
  @Child(s.layout) private layoutContainer!: HTMLDivElement;

  @Child(s.toolbarSorting) private sortingContainer!: HTMLDivElement;

  @Child(s.sortingToggle) private sortingToggleBtn!: HTMLButtonElement;

  @Child(s.sortingList) private sortingList!: HTMLElement;

  private backdrop = new Backdrop({ onclick: this.hideSortingWindow.bind(this) });

  private selectedFilterItem?: HTMLElement;

  protected componentDidRender(): void {
    delegate(this.layoutContainer, '[data-layout]', MouseEvtName.CLICK, (target) => {
      assertIsHTMLElement(target);
      const { layout } = target.dataset;
      if (layout) this.notifyLayoutChange(layout as unknown as CardsLayout);
    });

    delegate(this.sortingContainer, '[data-sort-type]', MouseEvtName.CLICK, this.changeSorting.bind(this));
    delegate(this.sortingContainer, '[data-sort-type]', MouseEvtName.CLICK, this.hideSortingWindow.bind(this));
  }

  render(): JSX.Element {
    return (
      <div className={s.toolbar}>
        <button className={s.filterBtn} onclick={this.notifyFilterOpen.bind(this)}>
          <span>{FilterIcon}</span>
          Filter
        </button>
        {this.renderDropDown()}
        <div className={s.toolbarLayout}>
          <span className={s.layoutText}>View</span>
          {
            <div className={s.layout}>
              <button className={s.layoutBtn} dataset={{ layout: CardsLayout.Grid }}>
                {GridIcon}
              </button>
              <button className={s.layoutBtn} dataset={{ layout: CardsLayout.List }}>
                {ListIcon}
              </button>
            </div>
          }
        </div>
        {this.backdrop.render()}
      </div>
    );
  }

  private renderDropDown(): JSX.Element {
    return (
      <div className={cx(s.toolbarSorting, 'dropdown-center')}>
        <span className={s.sortByText}>Sort By:</span>
        <button className={s.sortByToggle} onclick={this.showSortingWindow.bind(this)}>
          Sort By:
        </button>
        {
          <>
            <button
              className={cx(s.sortingToggle, 'dropdown-toggle')}
              dataset={{ bsToggle: 'dropdown', bsAutoClose: 'inside' }}
            >
              None
            </button>

            <ul className={cx('dropdown-menu', s.sortingList)}>
              <div className={s.sortingListHeading}>
                Sort By{' '}
                <button className={s.closeSortingBtn} onclick={this.hideSortingWindow.bind(this)}>
                  {CrossIcon.cloneNode(true)}
                </button>
              </div>
              <li className={cx('dropdown-item', s.sortingItem)}>
                <button
                  className={s.sortingBtn}
                  dataset={{ sortType: SortType.Name, sortDirection: SortDirection.Ascending }}
                >
                  Name ascending
                </button>
              </li>
              <li className={cx('dropdown-item', s.sortingItem)}>
                <button
                  className={s.sortingBtn}
                  dataset={{ sortType: SortType.Name, sortDirection: SortDirection.Descending }}
                >
                  Name descending
                </button>
              </li>
              <li className={cx('dropdown-item', s.sortingItem)}>
                <button
                  className={s.sortingBtn}
                  dataset={{ sortType: SortType.Price, sortDirection: SortDirection.Ascending }}
                >
                  Price ascending
                </button>
              </li>
              <li className={cx('dropdown-item', s.sortingItem)}>
                <button
                  className={s.sortingBtn}
                  dataset={{ sortType: SortType.Price, sortDirection: SortDirection.Descending }}
                >
                  Price descending
                </button>
              </li>
            </ul>
          </>
        }
      </div>
    );
  }

  private showSortingWindow(): void {
    this.sortingList.classList.add(s.show);
    this.backdrop.show();
  }

  private hideSortingWindow(): void {
    this.sortingList.classList.remove(s.show);
    this.backdrop.hide();
  }

  private changeSorting(target: Element): void {
    assertIsHTMLElement(target);
    const { sortType: type, sortDirection: direction } = target.dataset;

    if (type && direction) {
      const item = target.closest('.dropdown-item');
      assertIsHTMLElement(item);

      if (this.selectedFilterItem) {
        this.selectedFilterItem.classList.remove(s.selected);
      }

      if (item) {
        item.classList.add(s.selected);
        this.selectedFilterItem = item;
      }

      this.sortingToggleBtn.textContent = target.textContent;
      this.notifySortingChange({ type, direction } as ISortBy);
    }
  }

  private notifyLayoutChange(layout: CardsLayout): void {
    this.getContent().dispatchEvent(new CustomEvent(ToolbarEvent.LayoutChange, { detail: { layout }, bubbles: true }));
  }

  private notifySortingChange(sortOptions: ISortBy): void {
    this.getContent().dispatchEvent(new CustomEvent(ToolbarEvent.SoringChange, { detail: sortOptions, bubbles: true }));
  }

  private notifyFilterOpen(): void {
    this.getContent().dispatchEvent(new CustomEvent(ToolbarEvent.FilterOpen, { bubbles: true }));
  }
}

export default Toolbar;

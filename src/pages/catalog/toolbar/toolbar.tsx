/* eslint-disable max-lines-per-function */
import { element, fragment } from 'tsx-vanilla';
import cx from 'clsx';
import { Component, Child } from '@shared/lib';
import { delegate } from '@shared/utils/dom-helpers';
import { MouseEvtName } from '@shared/constants/events';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import { SortType, SortDirection } from '@shared/enums';
import { ISortBy } from '@shared/interfaces';
import * as s from './toolbar.module.scss';
import GridIcon from './assets/grid-icon.element.svg';
import ListIcon from './assets/list-icon.element.svg';
import { CardsLayout, ToolbarEvent } from './toolbar.enum';

class Toolbar extends Component {
  @Child(s.layout) private layoutContainer!: HTMLDivElement;

  @Child(s.toolbarSorting) private sortingContainer!: HTMLDivElement;

  @Child(s.sortingToggle) private sortingToggleBtn!: HTMLButtonElement;

  protected componentDidRender(): void {
    delegate(this.layoutContainer, '[data-layout]', MouseEvtName.CLICK, (target) => {
      assertIsHTMLElement(target);
      const { layout } = target.dataset;
      if (layout) this.notifyLayoutChange(layout as unknown as CardsLayout);
    });

    delegate(this.sortingContainer, '[data-sort-type]', MouseEvtName.CLICK, this.changeSorting.bind(this));
  }

  render(): JSX.Element {
    return (
      <div className={s.toolbar}>
        <p className={s.toolbarInfo}>Showing 1-48 of 319 products</p>

        <div className={cx(s.toolbarSorting, 'dropdown')}>
          Sort By:
          {
            <>
              <button className={cx(s.sortingToggle, 'dropdown-toggle')} dataset={{ bsToggle: 'dropdown' }}>
                None
              </button>

              <ul className={cx('dropdown-menu dropdown-menu-end')}>
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

        <div className={s.toolbarLayout}>
          View
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
      </div>
    );
  }

  private changeSorting(target: Element): void {
    assertIsHTMLElement(target);
    const { sortType: type, sortDirection: direction } = target.dataset;

    if (type && direction) {
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
}

export default Toolbar;

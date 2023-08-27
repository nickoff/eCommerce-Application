/* eslint-disable max-lines-per-function */
import { element, fragment } from 'tsx-vanilla';
import cx from 'clsx';
import { Component, Child } from '@shared/lib';
import { delegate } from '@shared/utils/dom-helpers';
import { MouseEvtName } from '@shared/constants/events';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import * as s from './toolbar.module.scss';
import GridIcon from './assets/grid-icon.element.svg';
import ListIcon from './assets/list-icon.element.svg';
import { CardsLayout, ToolbarEvent } from './toolbar.enum';

class Toolbar extends Component {
  @Child(s.layout) private layoutContainer!: HTMLDivElement;

  protected componentDidRender(): void {
    delegate(this.layoutContainer, '[data-layout]', MouseEvtName.CLICK, (target) => {
      assertIsHTMLElement(target);
      const { layout } = target.dataset;
      if (layout) this.notifyLayoutChange(layout as unknown as CardsLayout);
    });
  }

  render(): JSX.Element {
    return (
      <div className={s.toolbar}>
        <p className={s.toolbarInfo}>Showing 1-48 of 319 products</p>

        <div className={cx(s.toolbarSorting, 'dropdown')}>
          Sort By:{' '}
          {
            <>
              <button className={cx(s.sortingToggle, 'dropdown-toggle')} dataset={{ bsToggle: 'dropdown' }}>
                Best Selling
              </button>

              <ul className={cx('dropdown-menu dropdown-menu-end')}>
                <li className={cx('dropdown-item', s.sortingItem)}>
                  <button className={s.sortingBtn}>Tital ascending</button>
                </li>
                <li className={cx('dropdown-item', s.sortingItem)}>
                  <button className={s.sortingBtn}>Tital descending</button>
                </li>
                <li className={cx('dropdown-item', s.sortingItem)}>
                  <button className={s.sortingBtn}>Price ascending</button>
                </li>
                <li className={cx('dropdown-item', s.sortingItem)}>
                  <button className={s.sortingBtn}>Price descending</button>
                </li>
                <li className={cx('dropdown-item', s.sortingItem)}>
                  <button className={s.sortingBtn}>Created ascending</button>
                </li>
                <li className={cx('dropdown-item', s.sortingItem)}>
                  <button className={s.sortingBtn}>Created descending</button>
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

  private notifyLayoutChange(layout: CardsLayout): void {
    this.getContent().dispatchEvent(new CustomEvent(ToolbarEvent.LayoutChange, { detail: { layout }, bubbles: true }));
  }
}

export default Toolbar;

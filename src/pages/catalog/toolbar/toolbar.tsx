/* eslint-disable max-lines-per-function */
import { element, fragment } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import * as s from './toolbar.module.scss';
import GridIcon from './assets/grid-icon.svg';
import ListIcon from './assets/list-icon.svg';

class Toolbar extends Component {
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
              <button className={s.layoutBtn}>{GridIcon}</button>
              <button className={s.layoutBtn}>{ListIcon}</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Toolbar;

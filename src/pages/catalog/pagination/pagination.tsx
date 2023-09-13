import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import { IPaginationProps, PAGE_CHANGE_EVENT } from './pagination.interface';
import * as s from './pagination.module.scss';
import { btn, btnOutline } from '../../../styles/shared/index.module.scss';

class Pagination extends Component<IPaginationProps> {
  render(): JSX.Element {
    return (
      <div className={s.pagination}>
        <ul className={s.paginationList}>
          {Array.from({ length: this.totalPages }, (_, i) => {
            const isCurrent = i === this.currentPage;

            return (
              <li>
                <button
                  className={cx(btn, btnOutline, s.paginationBtn, isCurrent && s.paginationBtnCurrent)}
                  disabled={isCurrent}
                  onclick={(): void => this.notifyPageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  private notifyPageChange(page: number): void {
    this.getContent().dispatchEvent(new CustomEvent(PAGE_CHANGE_EVENT, { detail: { page }, bubbles: true }));
  }

  private get totalPages(): number {
    const { total, limit } = this.props;
    return Math.ceil(total / limit);
  }

  private get currentPage(): number {
    const { offset, limit } = this.props;
    return Math.floor(offset / limit);
  }
}

export default Pagination;

import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import { LANG_CODE } from '@shared/constants/misc';
import { Category, ProductType } from '@commercetools/platform-sdk';
import { BiMap } from '@jsdsl/bimap';
import { delegate } from '@shared/utils/dom-helpers';
import { MouseEvtName } from '@shared/constants/events';
import { padDot } from '@shared/utils/misc';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import * as s from './list.module.scss';
import { FilterBlockEvent, ListChangeEvent, FilterBlockType, IFilterPayload } from '../../filter-block.types';
import { IFilterBody, IFilterBodyProps } from '../filter-body.interface';

class FilterBodyList extends Component<IFilterBodyProps<Category[] | ProductType[]>> implements IFilterBody {
  private map = new BiMap<Category | ProductType, JSX.Element>();

  protected componentDidRender(): void {
    delegate(this.getContent(), padDot(s.filterBtn), MouseEvtName.CLICK, (target) => {
      const itemEl = target.closest(padDot(s.filterItem));
      assertIsHTMLElement(itemEl);
      const status = itemEl.toggleAttribute('data-selected');
      const category = this.map.getFromValue(itemEl);

      if (!category) {
        throw new Error('No category mapped for selected element');
      }

      this.notifyFilterChange(category, status);
    });
  }

  unselect(payload: IFilterPayload<Category>): void {
    this.map.get(payload.filter)?.toggleAttribute('data-selected');

    const newPayload = payload;
    newPayload.status = false;

    this.getContent().dispatchEvent(
      new CustomEvent<ListChangeEvent>(FilterBlockEvent.FilterChange, {
        detail: { type: FilterBlockType.List, payload: newPayload },
        bubbles: true,
      }),
    );
  }

  render(): JSX.Element {
    const { filterData } = this.props;

    return (
      <ul className={s.filterList}>
        {filterData.map((category) => {
          const itemEl = (
            <li className={s.filterItem}>
              <button className={s.filterBtn}>
                <span className={s.filterCheckbox}></span>
                <span className={s.filterName}>
                  {typeof category.name === 'string' ? category.name : category.name[LANG_CODE]}
                </span>
              </button>
            </li>
          );

          this.map.set(category, itemEl);
          return itemEl;
        })}
      </ul>
    );
  }

  private notifyFilterChange(category: Category | ProductType, status: boolean): void {
    const { filterBlock } = this.props;

    this.getContent().dispatchEvent(
      new CustomEvent<ListChangeEvent>(FilterBlockEvent.FilterChange, {
        detail: {
          type: FilterBlockType.List,
          payload: {
            filter: category,
            status,
            filterLabel: `${typeof category.name === 'string' ? category.name : category.name[LANG_CODE]}`,
            filterBlock,
            filterBody: this,
          },
        },
        bubbles: true,
      }),
    );
  }
}

export default FilterBodyList;

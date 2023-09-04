import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import { delegate } from '@shared/utils/dom-helpers';
import { MouseEvtName } from '@shared/constants/events';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import { Color } from '@shared/interfaces';
import { BiMap } from '@jsdsl/bimap';
import { padDot } from '@shared/utils/misc';
import * as s from './pallete.module.scss';
import { FilterBlockEvent, PalleteChangeEvent, FilterBlockType, IFilterPayload } from '../../filter-block.types';
import { IFilterBody, IFilterBodyProps } from '../filter-body.interface';

class FilterBodyPallete extends Component<IFilterBodyProps<Color[]>> implements IFilterBody {
  private map = new BiMap<Color, JSX.Element>();

  protected componentDidRender(): void {
    delegate(this.getContent(), 'button', MouseEvtName.CLICK, (target) => {
      const itemEl = target.closest(padDot(s.colorItem));
      assertIsHTMLElement(itemEl);
      const status = itemEl.toggleAttribute('data-selected');
      const color = this.map.getFromValue(itemEl);

      if (!color) {
        throw new Error('No value mapped to selected element');
      }

      this.notifyFilterChange(color, status);
    });
  }

  unselect(payload: IFilterPayload<Color>): void {
    this.map.get(payload.filter)?.toggleAttribute('data-selected');

    const newPayload = payload;
    newPayload.status = false;

    this.getContent().dispatchEvent(
      new CustomEvent<PalleteChangeEvent>(FilterBlockEvent.FilterChange, {
        detail: { type: FilterBlockType.Pallete, payload: newPayload },
        bubbles: true,
      }),
    );
  }

  render(): JSX.Element {
    const { filterData } = this.props;

    return (
      <ul className={s.colorList}>
        {filterData.map((color) => {
          const itemEl = (
            <li className={s.colorItem} style={{ backgroundColor: color.split(';')[0] }}>
              <button></button>
            </li>
          );

          this.map.set(color, itemEl);
          return itemEl;
        })}
      </ul>
    );
  }

  private notifyFilterChange(color: Color, status: boolean): void {
    const { filterBlock } = this.props;

    this.getContent().dispatchEvent(
      new CustomEvent<PalleteChangeEvent>(FilterBlockEvent.FilterChange, {
        detail: {
          type: FilterBlockType.Pallete,
          payload: { filter: color, status, filterLabel: `${color.split(';')[1]}`, filterBlock, filterBody: this },
        },
        bubbles: true,
      }),
    );
  }
}

export default FilterBodyPallete;

import { element } from 'tsx-vanilla';
import store from '@app/store/store';
import { Component } from '@shared/lib';
import * as s from './line-item-card.module.scss';
import { ILineItemProps } from './line-item-card.interface';

class LineItemCard extends Component<ILineItemProps> {
  constructor(...args: ILineItemProps[]) {
    super(...args);
    store.subscribe('cart', this);
  }

  render(): JSX.Element {
    const { name, price, discountedPrice, totalPrice, quantity, image } = this.props.lineItemData;

    return (
      <div className={s.lineItemCard}>
        <div className={s.lineItemCardLeftSide}>
          <div className={s.prodPhoto}>
            <img height="75" width="75" src={image} alt={`${name.split('')[0]} photo`} />
          </div>
          <p className={s.prodName}>{name}</p>
        </div>
        <div className={s.lineItemCardRightSide}>
          <p className={s.prodPricePerUnit}>{`$ ${discountedPrice ? discountedPrice / 100 : price / 100}`}</p>
          <p className={s.prodQuantity}>{`x${quantity}`}</p>
          <p className={s.prodTotalItem}>{`$ ${totalPrice / 100}`}</p>
        </div>
      </div>
    );
  }
}

export default LineItemCard;

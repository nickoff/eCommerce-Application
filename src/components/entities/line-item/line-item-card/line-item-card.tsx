import { element } from 'tsx-vanilla';
import store from '@app/store/store';
import cx from 'clsx';
import { Component, Child } from '@shared/lib';
import TrashIcon from '@assets/icons/trash.element.svg';
import CartRepoService from '@shared/api/cart/cart-repo.service';
import { isHttpErrorType } from '@shared/utils/type-guards';
import * as s from './line-item-card.module.scss';
import { ILineItemProps } from './line-item-card.interface';
import { btn, btnOutLine } from '../../../../styles/shared/index.module.scss';

class LineItemCard extends Component<ILineItemProps> {
  constructor(...args: ILineItemProps[]) {
    super(...args);
    store.subscribe('cart', this);
  }

  private cartId = store.getState().cart?.id;

  @Child('output', true) quantityOutput!: HTMLOutputElement;

  render(): JSX.Element {
    const { id, name, productId, price, discountedPrice, totalPrice, quantity, image } = this.props.lineItemData;

    return (
      <div className={s.lineItemCard}>
        <div className={s.lineItemCardLeftSide}>
          <div className={s.prodPhoto}>
            <img height="75" width="75" src={image} alt={`${name.split('')[0]} photo`} />
          </div>
          <p className={s.prodName}>{name}</p>
        </div>
        <div className={s.lineItemCardRightSide}>
          <p className={s.prodPricePerUnit}>
            {`$ ${discountedPrice ? discountedPrice / 100 : price / 100}`}
            <div className={s.quantityCounter}>
              <button onclick={this.decreaseQuantity.bind(this, id)}>-</button>
              <output>{`x${quantity}`}</output>
              <button onclick={this.increaseQuantity.bind(this, productId)}>+</button>
            </div>
          </p>
          <p className={s.prodTotalItem}>
            {`$ ${totalPrice / 100}`}
            <button
              className={cx(btn, btnOutLine, s.removeToCartBtn)}
              onclick={this.onRemoveToCartClick.bind(this, id)}
            >
              {TrashIcon.cloneNode(true)}
            </button>
          </p>
        </div>
      </div>
    );
  }

  private async onRemoveToCartClick(id: string): Promise<void> {
    const versionCart = store.getState().cart?.version;
    const lineItemId = store.getState().cart?.lineItems.find((lineItem) => lineItem.id === id)?.id;

    if (!versionCart || !this.cartId || !lineItemId) return;
    const updateCart = await CartRepoService.removeLineItemToCart(store.apiRoot, lineItemId, versionCart, this.cartId);
    if (!isHttpErrorType(updateCart)) {
      store.setState({ cart: updateCart });
    }
  }

  private async decreaseQuantity(id: string): Promise<void> {
    const versionCart = store.getState().cart?.version;
    const lineItemId = store.getState().cart?.lineItems.find((lineItem) => lineItem.id === id)?.id;

    if (!versionCart || !this.cartId || !lineItemId) return;
    const updateCart = await CartRepoService.removeLineItemToCart(
      store.apiRoot,
      lineItemId,
      versionCart,
      this.cartId,
      1,
    );
    if (!isHttpErrorType(updateCart)) {
      store.setState({ cart: updateCart });
    }
  }

  private async increaseQuantity(poductId: string): Promise<void> {
    const versionCart = store.getState().cart?.version;

    if (!versionCart || !this.cartId) return;
    const updateCart = await CartRepoService.addLineItemToCart(store.apiRoot, poductId, versionCart, this.cartId);
    if (!isHttpErrorType(updateCart)) {
      store.setState({ cart: updateCart });
    }
  }
}

export default LineItemCard;

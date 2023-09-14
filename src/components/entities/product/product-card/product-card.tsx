/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */
import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import { centsToMoney } from '@shared/utils/misc';
import { LANG_CODE } from '@shared/constants/misc';
import CartRepoService from '@shared/api/cart/cart-repo.service';
import store from '@app/store/store';
import { isHttpErrorType } from '@shared/utils/type-guards';
import * as s from './product-card.module.scss';
import { btn, btnFilled } from '../../../../styles/shared/index.module.scss';
import { IProductCardProps } from './product-card.interface';

class ProductCard extends Component<IProductCardProps> {
  constructor(...args: IProductCardProps[]) {
    super(...args);
    store.subscribe('customer', this);
    store.subscribe('cart', this);
  }

  private smallImages = this.props.productData.images.filter((i) => i.dimensions.w < 400);

  private cartId = store.getState().cart?.id;

  render(): JSX.Element {
    if (this.props.expanded) return this.renderExpanded();

    const { name, prices, detailsPath, vendor, discountedPrice, id } = this.props.productData;

    return (
      <div className={s.prodCard}>
        <a className={s.imgLink} href={detailsPath} dataset={{ navigo: '' }}>
          <img
            height="250"
            width="250"
            className={s.prodCardImg}
            dataset={{ img: '1' }}
            src={this.smallImages[0].url}
            alt={this.smallImages[0].label}
          />
          <img
            height="250"
            width="250"
            className={cx(s.prodCardImg)}
            dataset={{ img: '2' }}
            src={this.smallImages[1].url}
            alt={this.smallImages[1].label}
          />
        </a>
        <a href={`/${vendor.slug[LANG_CODE]}`} className={s.prodCardVendor}>
          {vendor.name[LANG_CODE]}
        </a>
        <p className={s.prodCardPrice}>
          <span>{`$${centsToMoney(discountedPrice || prices[0].value.centAmount)}`}</span>
          <span className={s.prodOldPrice}>{discountedPrice && `$${centsToMoney(prices[0].value.centAmount)}`}</span>
        </p>
        <a className={s.prodCardName} href={detailsPath} dataset={{ navigo: '' }}>
          {name}
        </a>
        <button
          className={cx(btn, btnFilled, s.prodCardBtn, this.isLineItemInCart(id) && s.prodCardBtnInCart)}
          onclick={this.onAddToCartClick.bind(this, id)}
          disabled={this.isLineItemInCart(id)}
        >
          {this.isLineItemInCart(id) ? 'IN CART' : 'ADD TO CART'}
        </button>
      </div>
    );
  }

  renderExpanded(): JSX.Element {
    const { name, vendor, prices, description, detailsPath, discountedPrice, id } = this.props.productData;
    return (
      <div className={cx(s.prodCard, s.prodCardExpanded)}>
        <div className={s.prodCardImgContainer}>
          <a href={detailsPath} dataset={{ navigo: '' }}>
            <img
              height="250"
              width="250"
              className={s.prodCardImg}
              dataset={{ img: '1' }}
              src={this.smallImages[0].url}
              alt={this.smallImages[0].label}
            />
            <img
              height="250"
              width="250"
              className={cx(s.prodCardImg)}
              dataset={{ img: '2' }}
              src={this.smallImages[1].url}
              alt={this.smallImages[1].label}
            />
          </a>
          <button
            className={cx(btn, btnFilled, s.prodCardBtn, this.isLineItemInCart(id) && s.prodCardBtnInCart)}
            onclick={this.onAddToCartClick.bind(this, id)}
            disabled={this.isLineItemInCart(id)}
          >
            {this.isLineItemInCart(id) ? 'IN CART' : 'ADD TO CART'}
          </button>
        </div>
        <div className={s.prodCardBody}>
          <a href={`/${vendor.slug[LANG_CODE]}`} className={s.prodCardVendor}>
            {vendor.name[LANG_CODE]}
          </a>
          <p className={s.prodCardPrice}>
            <span>{`$${centsToMoney(discountedPrice || prices[0].value.centAmount)}`}</span>
            <span className={s.prodOldPrice}>{discountedPrice && `$${centsToMoney(prices[0].value.centAmount)}`}</span>
          </p>
          <a href={detailsPath} className={s.prodCardName} dataset={{ navigo: '' }}>
            {name}
          </a>
          <div className={cx(s.prodCardDesc)} innerHTML={description}></div>
        </div>
      </div>
    );
  }

  private async onAddToCartClick(id: string): Promise<void> {
    const versionCart = store.getState().cart?.version;

    if (!versionCart || !this.cartId) return;
    const updateCart = await CartRepoService.addLineItemToCart(store.apiRoot, id, versionCart, this.cartId);
    if (!isHttpErrorType(updateCart)) {
      store.setState({ cart: updateCart });
    }
    this.getContent();
  }

  private isLineItemInCart(id: string): boolean {
    return !!store.getState().cart?.lineItems.find((lineItem) => lineItem.productId === id);
  }
}

export default ProductCard;

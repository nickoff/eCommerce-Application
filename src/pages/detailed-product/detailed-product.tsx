/* eslint-disable max-lines-per-function */
import { element } from 'tsx-vanilla';
import { Component, Child } from '@shared/lib';
import Product from '@components/entities/product/product';
import cx from 'clsx';
import { centsToMoney } from '@shared/utils/misc';
import { Carousel, Fancybox } from '@fancyapps/ui';
import { SITE_TITLE } from '@shared/constants/seo';
import Expandable from '@components/shared/ui/expandable/expandable';
import store from '@app/store/store';
import { isHttpErrorType } from '@shared/utils/type-guards';
import CartRepoService from '@shared/api/cart/cart-repo.service';
import TrashIcon from '@assets/icons/trash.element.svg';
import { IDetailedProductPageProps } from './detailed-product.interface';
import { btn, btnFilled, btnOutLine } from '../../styles/shared/index.module.scss';
import * as s from './detailed-product.module.scss';
import '@fancyapps/ui/dist/carousel/carousel.css';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import './carousel-override.scss';

class DetailedProductPage extends Component<IDetailedProductPageProps> {
  private product = new Product(this.props.productData);

  private cartId = store.getState().cart?.id;

  private quantity = 1;

  @Child('#myCarousel', true) carouselContainer!: HTMLElement;

  @Child('output', true) quantityOutput!: HTMLOutputElement;

  private carousel!: Carousel;

  constructor(props: IDetailedProductPageProps) {
    super(props);
    document.title = `${this.product.name} | ${SITE_TITLE}`;
    store.subscribe('cart', this);
  }

  protected componentDidRender(): void {
    this.carousel = new Carousel(this.carouselContainer, { transition: 'slide' });

    Fancybox.bind('[data-fancybox]', {
      Carousel: { transition: 'slide' },
      Thumbs: {
        type: 'classic',
      },
    });
  }

  render(): JSX.Element {
    const { name, description, attributes, prices, discountedPrice, id } = this.product;

    return (
      <div className={s.layoutContainer}>
        <div className={cx(s.card, s.gallery)}>{this.renderCarousel()}</div>
        <div className={cx(s.card, s.meta)}>
          <p className={s.cardHeading}>{name}</p>
          <p className={s.prodVendor}>{attributes?.vendor}</p>
          <hr className={s.cardSeperator} />
          <p className={s.prodPrice}>
            <span>{`$${centsToMoney(discountedPrice || prices[0].value.centAmount)}`}</span>
            <span className={s.prodOldPrice}>{discountedPrice && `$${centsToMoney(prices[0].value.centAmount)}`}</span>
          </p>
          <div className={s.quantityCounter}>
            <button onclick={this.decreaseQuantity.bind(this)} disabled={this.isLineItemInCart(id)}>
              -
            </button>
            <output>
              {this.isLineItemInCart(id)
                ? store.getState().cart?.lineItems.find((lineItem) => lineItem.productId === id)?.quantity
                : this.quantity}
            </output>
            <button onclick={this.increaseQuantity.bind(this)} disabled={this.isLineItemInCart(id)}>
              +
            </button>
          </div>
          <button
            className={cx(btn, btnFilled, s.addToCartBtn, this.isLineItemInCart(id) && s.addBtnInCart)}
            disabled={this.isLineItemInCart(id)}
            onclick={this.onAddToCartClick.bind(this, id)}
          >
            {this.isLineItemInCart(id) ? 'IN CART' : 'ADD TO CART'}
          </button>
          {this.isLineItemInCart(id) && (
            <button
              className={cx(btn, btnOutLine, s.removeToCartBtn)}
              onclick={this.onRemoveToCartClick.bind(this, id)}
            >
              {TrashIcon}
            </button>
          )}
        </div>
        <div className={cx(s.card, s.desc)}>
          <p className={s.cardHeading}>Description</p>
          {new Expandable({
            content: <div className={s.descTextContainer} innerHTML={description}></div>,
            className: s.descExpandable,
            maxHeight: 250,
          }).render()}
        </div>
      </div>
    );
  }

  private renderCarousel(): JSX.Element {
    const { images } = this.product;

    return (
      <div className="f-carousel" id="myCarousel">
        {images
          .filter((i) => i.dimensions.w > 400)
          .map((i) => {
            return (
              <div className="f-carousel__slide" dataset={{ fancybox: 'gallery', src: i.url }}>
                <img src={i.url} data-lazy-src={i.url} alt={i.label} />
              </div>
            );
          })}
      </div>
    );
  }

  private decreaseQuantity(): void {
    const quantity = +this.quantityOutput.value;
    if (quantity === 1) return;
    this.quantityOutput.value = String(quantity - 1);
  }

  private increaseQuantity(): void {
    const quantity = +this.quantityOutput.value;
    this.quantityOutput.value = String(quantity + 1);
  }

  private isLineItemInCart(id: string): boolean {
    return !!store.getState().cart?.lineItems.find((lineItem) => lineItem.productId === id);
  }

  private async onAddToCartClick(id: string): Promise<void> {
    const versionCart = store.getState().cart?.version;
    const quantity = +this.quantityOutput.value;

    if (!versionCart || !this.cartId) return;
    const updateCart = await CartRepoService.addLineItemToCart(store.apiRoot, id, versionCart, this.cartId, quantity);
    if (!isHttpErrorType(updateCart)) {
      store.setState({ cart: updateCart });
    }
  }

  private async onRemoveToCartClick(id: string): Promise<void> {
    const versionCart = store.getState().cart?.version;
    const lineItemId = store.getState().cart?.lineItems.find((lineItem) => lineItem.productId === id)?.id;

    if (!versionCart || !this.cartId || !lineItemId) return;
    const updateCart = await CartRepoService.removeLineItemToCart(store.apiRoot, lineItemId, versionCart, this.cartId);
    if (!isHttpErrorType(updateCart)) {
      store.setState({ cart: updateCart });
    }
  }
}

export default DetailedProductPage;

import { element } from 'tsx-vanilla';
import { Component, Child } from '@shared/lib';
import Product from '@components/entities/product/product';
import cx from 'clsx';
import { centsToMoney } from '@shared/utils/misc';
import { Carousel, Fancybox } from '@fancyapps/ui';
import { SITE_TITLE } from '@shared/constants/seo';
import Expandable from '@components/shared/ui/expandable/expandable';
import { IDetailedProductPageProps } from './detailed-product.interface';
import { btn, btnFilled } from '../../styles/shared/index.module.scss';
import * as s from './detailed-product.module.scss';
import '@fancyapps/ui/dist/carousel/carousel.css';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import './carousel-override.scss';

class DetailedProductPage extends Component<IDetailedProductPageProps> {
  private product = new Product(this.props.productData);

  @Child('#myCarousel', true) carouselContainer!: HTMLElement;

  @Child('output', true) quantityOutput!: HTMLOutputElement;

  private carousel!: Carousel;

  constructor(props: IDetailedProductPageProps) {
    super(props);
    document.title = `${this.product.name} | ${SITE_TITLE}`;
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
    const { name, description, attributes, prices } = this.product;

    return (
      <div className={s.layoutContainer}>
        <div className={cx(s.card, s.gallery)}>{this.renderCarousel()}</div>
        <div className={cx(s.card, s.meta)}>
          <p className={s.cardHeading}>{name}</p>
          <p className={s.prodVendor}>{attributes?.vendor}</p>
          <hr className={s.cardSeperator} />
          <p className={s.prodPrice}>{`$${centsToMoney(prices[0].value.centAmount)}`}</p>
          <div className={s.quantityCounter}>
            <button onclick={this.decreaseQuantity.bind(this)}>-</button>
            <output>1</output>
            <button onclick={this.increaseQuantity.bind(this)}>+</button>
          </div>
          <button className={cx(btn, btnFilled, s.addToCartBtn)}>ADD TO CART</button>
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
        {images.map((i) => (
          <div className="f-carousel__slide" dataset={{ fancybox: 'gallery', src: i.url }}>
            <img src={i.url} data-lazy-src={i.url} alt={i.label} />
          </div>
        ))}
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
}

export default DetailedProductPage;

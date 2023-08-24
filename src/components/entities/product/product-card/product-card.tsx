import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import { centsToMoney } from '@shared/utils/misc';
import * as s from './product-card.module.scss';
import { btn, btnFilled } from '../../../../styles/shared/index.module.scss';
import { IProductCardProps } from './product-card.interface';

class ProductCard extends Component<IProductCardProps> {
  render(): JSX.Element {
    const { name, images, attributes, prices } = this.props.productData;

    return (
      <article className={s.prodCard}>
        <img className={s.prodCardImg} src={images[0].url} alt={images[0].label} />
        <p className={s.prodCardVendor}>{attributes?.vendor}</p>
        <p className={s.prodCardPrice}>{`$${centsToMoney(prices[0].value.centAmount)}`}</p>
        <a className={s.prodCardName}>{name}</a>
        <button className={cx(btn, btnFilled, s.prodCardBtn)}>ADD TO CART</button>
      </article>
    );
  }
}

export default ProductCard;

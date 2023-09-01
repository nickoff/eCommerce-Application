import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import { centsToMoney } from '@shared/utils/misc';
import * as s from './product-card.module.scss';
import { btn, btnFilled } from '../../../../styles/shared/index.module.scss';
import { IProductCardProps } from './product-card.interface';

class ProductCard extends Component<IProductCardProps> {
  render(): JSX.Element {
    if (this.props.expanded) return this.renderExpanded();

    const { name, images, attributes, prices, detailsPath } = this.props.productData;

    return (
      <div className={s.prodCard}>
        <img className={s.prodCardImg} src={images[0].url} alt={images[0].label} />
        <p className={s.prodCardVendor}>{attributes?.vendor}</p>
        <p className={s.prodCardPrice}>{`$${centsToMoney(prices[0].value.centAmount)}`}</p>
        <a className={s.prodCardName} href={detailsPath} dataset={{ navigo: '' }}>
          {name}
        </a>
        <button className={cx(btn, btnFilled, s.prodCardBtn)}>ADD TO CART</button>
      </div>
    );
  }

  renderExpanded(): JSX.Element {
    const { name, images, attributes, prices, description } = this.props.productData;

    return (
      <div className={cx(s.prodCard, s.prodCardExpanded)}>
        <div className={s.prodCardImgContainer}>
          <img className={s.prodCardImg} src={images[0].url} alt={images[0].label} />
          <button className={cx(btn, btnFilled, s.prodCardBtn)}>ADD TO CART</button>
        </div>
        <div className={s.prodCardBody}>
          <p className={s.prodCardVendor}>{attributes?.vendor}</p>
          <p className={s.prodCardPrice}>{`$${centsToMoney(prices[0].value.centAmount)}`}</p>
          <a className={s.prodCardName} dataset={{ navigo: '' }}>
            {name}
          </a>
          <div className={cx(s.prodCardDesc)} innerHTML={description}></div>
        </div>
      </div>
    );
  }
}

export default ProductCard;

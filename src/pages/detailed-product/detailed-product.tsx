import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import Product from '@components/entities/product/product';
import cx from 'clsx';
import { centsToMoney } from '@shared/utils/misc';
import { IDetailedProductPageProps } from './detailed-product.interface';
import * as s from './detailed-product.module.scss';

class DetailedProductPage extends Component<IDetailedProductPageProps> {
  private product = new Product(this.props.productData);

  render(): JSX.Element {
    const { images, name, attributes, prices } = this.product;

    return (
      <div className={s.layoutContainer}>
        <div className={cx(s.card, s.gallery)}>
          <img src={images[0].url} alt="" />
        </div>
        <div className={cx(s.card, s.meta)}>
          <p className={s.prodName}>{name}</p>
          <p className={s.prodVendor}>{attributes?.vendor}</p>
          <hr className={s.cardSeperator} />
          <p className={s.prodPrice}>{`$${centsToMoney(prices[0].value.centAmount)}`}</p>
        </div>
        <div className={cx(s.card, s.desc)}></div>
      </div>
    );
  }
}

export default DetailedProductPage;

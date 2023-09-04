import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import Product from '@components/entities/product/product';
import ProductCard from '@components/entities/product/product-card/product-card';
import { ProductProjection } from '@commercetools/platform-sdk';
import NeverError from '@shared/types/never-error';
import { IProdCollectionProps } from './product-collection.interface';
import * as s from './product-collection.module.scss';
import { CardsLayout } from '../toolbar/toolbar.enum';

const ProdCollectionVariant = {
  Grid: [s.prodCollection, 'row', 'row-cols-auto', 'row-cols-2xs-2', 'row-cols-md-3', 'row-cols-2xl-4', 'g-4'],
  List: [s.prodCollection, s.prodCollectionList],
};

class ProductCollection extends Component<IProdCollectionProps> {
  private prodCards!: ProductCard[];

  render(): JSX.Element {
    const { productsData } = this.props;

    return <div className={cx(ProdCollectionVariant.Grid)}>{productsData && this.renderProdCards(productsData)}</div>;
  }

  changeLayout(layout: CardsLayout): void {
    switch (layout) {
      case CardsLayout.List:
        this.getContent().className = cx(ProdCollectionVariant.List);
        this.prodCards?.forEach((card) => card.setProps({ expanded: true }));
        break;
      case CardsLayout.Grid:
        this.getContent().className = cx(ProdCollectionVariant.Grid);
        this.prodCards?.forEach((card) => card.setProps({ expanded: false }));
        break;
      default:
        throw new NeverError(layout);
    }
  }

  private renderProdCards(productsData: ProductProjection[]): JSX.Element[] {
    this.prodCards = productsData.map((prodData) => new ProductCard({ productData: new Product(prodData) }));
    return this.prodCards.map((card) => <div className="col d-flex">{card.render()}</div>);
  }
}

export default ProductCollection;

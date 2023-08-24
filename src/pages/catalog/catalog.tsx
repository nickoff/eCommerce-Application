import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import ProductListService from '@shared/api/product/product-list.service';
import Store from '@app/store/store';
import { CategoryId } from '@shared/enums';
import Product from '@components/entities/product/product';
import ProductCard from '@components/entities/product/product-card/product-card';
import { isHttpErrorType } from '@shared/utils/type-guards';
import * as s from './catalog.module.scss';

class CatalogPage extends Component {
  private productCards: ProductCard[] | null = null;

  render(): JSX.Element {
    if (!this.productCards) this.load();

    return (
      <div className="d-flex ">
        <div className={s.sortingContainer}></div>
        <div className={cx(s.productsContainer, 'container-fluid')}>
          <div className="row row-cols-auto row-cols-2xs-2 row-cols-md-3 row-cols-2xl-4 g-4 justify-content-center">
            {this.productCards && this.productCards.map((card) => <div className="col">{card.render()}</div>)}
          </div>
        </div>
      </div>
    );
  }

  async load(): Promise<void> {
    const { apiRoot } = Store.getState();
    const productsResp = await ProductListService.getProductsByCategory(apiRoot, CategoryId.Headphones);

    if (!isHttpErrorType(productsResp)) {
      // this.productCards = productsResp.map((prod) => new ProductCard({ productData: new Product(prod) }));

      this.productCards = Array.from({ length: 12 }, () =>
        productsResp.map((prod) => new ProductCard({ productData: new Product(prod), className: s.gridCard })),
      ).flat();

      this.render();
    }
  }
}

export default CatalogPage;

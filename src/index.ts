/* eslint-disable no-console */
import './styles/main.scss';
import App from '@app/app';
import ProductListService from '@shared/api/product/product-list.service';
import Store from '@app/store/store';
import { CategoryId } from '@shared/enums';
import ProductCard from '@components/entities/product/product-card/product-card';
import Product from '@components/entities/product/product';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { qs } from '@shared/utils/dom-helpers';

App.init();

const { apiRoot } = Store.getState();

async function init(): Promise<void> {
  const result = await ProductListService.getProductsByCategory(apiRoot, CategoryId.Headphones);

  if (!isHttpErrorType(result)) {
    const product = new Product(result[0]);
    const productCard = new ProductCard({ productData: product }).render();
    qs('.page-wrapper_WSgoLWdMhj').append(productCard);
  }
}

init();

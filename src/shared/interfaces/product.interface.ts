import { type ProductVariant, type ProductType, type Category } from '@commercetools/platform-sdk';
import { type IProductAttributes } from './product-attributes';

export interface IProduct {
  readonly name: string;
  readonly description: string;
  readonly slug: string;
  readonly prices: NonNullable<ProductVariant['prices']>;
  readonly images: NonNullable<ProductVariant['images']>;
  readonly detailsPath: string;
  readonly productType: ProductType;
  readonly vendor: Category;
  readonly attributes?: IProductAttributes;
}

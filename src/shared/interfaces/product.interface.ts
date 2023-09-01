import { type ProductVariant, type Category } from '@commercetools/platform-sdk';
import { type IProductAttributes } from './product-attributes';

export interface IProduct {
  readonly name: string;
  readonly description: string;
  readonly slug: string;
  readonly prices: NonNullable<ProductVariant['prices']>;
  readonly images: NonNullable<ProductVariant['images']>;
  readonly detailsPath: string;
  readonly category: Category;
  readonly vendor: string;
  readonly attributes?: IProductAttributes;
}

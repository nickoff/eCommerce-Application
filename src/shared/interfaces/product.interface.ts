import { type ProductVariant } from '@commercetools/platform-sdk';
import { type IProductAttributes } from './product-attributes';

export interface IProduct {
  readonly name: string;
  readonly description: string;
  readonly prices: NonNullable<ProductVariant['prices']>;
  readonly images: NonNullable<ProductVariant['images']>;
  readonly attributes?: IProductAttributes;
}

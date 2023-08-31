import { IProduct } from '@shared/interfaces';
import { ProductProjection } from '@commercetools/platform-sdk';
import { LANG_CODE } from '@shared/constants/misc';
import createProductAttributesObject from './createProductAttributesObject';

export default class Product implements IProduct {
  readonly name: string;

  readonly description: string;

  readonly prices: IProduct['prices'];

  readonly images: IProduct['images'];

  readonly attributes: IProduct['attributes'];

  constructor(prod: ProductProjection) {
    this.name = prod.name?.[LANG_CODE];
    this.description = prod.description?.[LANG_CODE] ?? '';
    this.prices = prod.masterVariant.prices as IProduct['prices'];
    this.images = prod.masterVariant.images as IProduct['images'];

    const attributesRespData = prod.masterVariant.attributes;
    this.attributes = createProductAttributesObject(attributesRespData);
  }
}

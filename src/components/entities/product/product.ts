import { IProduct } from '@shared/interfaces';
import { ProductProjection, Category } from '@commercetools/platform-sdk';
import { LANG_CODE } from '@shared/constants/misc';
import createProductAttributesObject from './createProductAttributesObject';

export default class Product implements IProduct {
  readonly name: string;

  readonly description: string;

  readonly prices: IProduct['prices'];

  readonly images: IProduct['images'];

  readonly attributes: IProduct['attributes'];

  readonly slug: string;

  readonly detailsPath: string;

  readonly category: Category;

  readonly vendor: string;

  constructor(prod: ProductProjection) {
    this.name = prod.name?.[LANG_CODE];
    this.description = prod.description?.[LANG_CODE] ?? '';
    this.prices = prod.masterVariant.prices as IProduct['prices'];
    this.images = prod.masterVariant.images as IProduct['images'];
    this.slug = prod.slug[LANG_CODE];
    this.category = prod.categories.find((cat) => cat.obj?.key?.includes('type'))?.obj as Category;
    this.vendor = prod.categories.find((cat) => cat.obj?.key?.includes('vendor'))?.obj?.name[LANG_CODE] as string;
    this.detailsPath = `/${this.category.slug[LANG_CODE]}/${this.slug}`;

    const attributesRespData = prod.masterVariant.attributes;
    this.attributes = createProductAttributesObject(attributesRespData);
  }
}

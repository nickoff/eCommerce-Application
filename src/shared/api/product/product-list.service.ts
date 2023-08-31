import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import { ApiRoot } from '@shared/types';
import {
  type ProductProjection,
  type Category,
  type ProductType,
  type AttributeEnumType,
  type AttributePlainEnumValue,
} from '@commercetools/platform-sdk';
import { ProductCategoryId } from '@shared/enums';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { IFilterBy, ISortBy } from '@shared/interfaces';
import extractHttpError from '../extract-http-error.decorator';
import { ProductTypeKey } from '../../enums';
import { filterQueryBuilder } from './filter-query-builder';

class ProductListService {
  @extractHttpError
  static async getProductsByCategory(
    apiRoot: ApiRoot,
    categoryId: ProductCategoryId,
  ): Promise<ProductProjection[] | HttpErrorType> {
    const response = await apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: `categories.id:"${categoryId}"` } })
      .execute();

    return response.body.results;
  }

  @extractHttpError
  static async getCategories(apiRoot: ApiRoot): Promise<Category[] | HttpErrorType> {
    const response = await apiRoot.categories().get().execute();
    return response.body.results;
  }

  @extractHttpError
  static async getProductsWithFilter(
    apiRoot: ApiRoot,
    filter: IFilterBy,
    sort?: ISortBy,
  ): Promise<ProductProjection[] | HttpErrorType> {
    const query = this.buildFilterQuery(filter);

    const queryArgs: { filter: string[]; sort?: string } = { filter: query };

    if (sort) {
      queryArgs.sort = `${sort.type} ${sort.direction}`;
    }

    const response = await apiRoot.productProjections().search().get({ queryArgs }).execute();

    return response.body.results;
  }

  private static buildFilterQuery(filter: IFilterBy): string[] {
    return Object.entries(filter).reduce((acc, [criteria, values]) => {
      if (Array.isArray(values) && !values.length) return acc;

      let searchValue = values;

      if (Array.isArray(searchValue)) {
        searchValue = values.map((val: string) => `"${val}"`).join(',');
      }

      const query = filterQueryBuilder[criteria](searchValue);
      acc.push(query);

      return acc;
    }, [] as string[]);
  }

  @extractHttpError
  static async getProductTypeByKey(apiRoot: ApiRoot, key: ProductTypeKey): Promise<ProductType | HttpErrorType> {
    const response = await apiRoot.productTypes().withKey({ key }).get().execute();
    return response.body;
  }

  static async getAttributeOfProductType(
    apiRoot: ApiRoot,
    attrName: string,
    key: ProductTypeKey,
  ): Promise<AttributePlainEnumValue[] | HttpErrorType> {
    const result = await this.getProductTypeByKey(apiRoot, key);

    if (isHttpErrorType(result)) {
      return result;
    }

    const { attributes } = result;

    const attribute = attributes?.find((attr) => attr.name === attrName);

    if (!attribute) {
      throw new Error(`ProductType with ${key} key is missing ${attrName} attribute`);
    }

    return (attribute.type as AttributeEnumType).values;
  }
}

export default ProductListService;

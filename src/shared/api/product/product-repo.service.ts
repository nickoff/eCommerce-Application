import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import {
  type ProductProjection,
  type Category,
  type ProductType,
  type AttributeEnumType,
  type AttributePlainEnumValue,
  type ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';
import { ProductCategoryId } from '@shared/enums';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { IFilterBy, ISortBy } from '@shared/interfaces';
import { TermFacetResult, FacetResults } from '@commercetools/platform-sdk';
import Store from '@app/store/store';
import { LANG_CODE } from '@shared/constants/misc';
import extractHttpError from '../extract-http-error.decorator';
import { ProductTypeKey } from '../../enums';
import { filterQueryBuilder } from './filter-query-builder';
import { searchResultsLimit } from './config';

class ProductRepoService {
  @extractHttpError
  static async getProductsByCategory(categoryId: ProductCategoryId): Promise<ProductProjection[] | HttpErrorType> {
    const response = await Store.apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: `categories.id:"${categoryId}"` } })
      .execute();

    return response.body.results;
  }

  @extractHttpError
  static async getCategories(): Promise<Category[] | HttpErrorType> {
    const response = await Store.apiRoot.categories().get().execute();
    return response.body.results;
  }

  @extractHttpError
  static async getProductsWithFilter(filter: IFilterBy, sort?: ISortBy): Promise<ProductProjection[] | HttpErrorType> {
    const query = this.buildFilterQuery(filter);

    const queryArgs: { filter: string[]; sort?: string } = { filter: query };

    if (sort) {
      queryArgs.sort = `${sort.type} ${sort.direction}`;
    }

    const response = await Store.apiRoot.productProjections().search().get({ queryArgs }).execute();

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
  static async getProductTypeByKey(key: ProductTypeKey): Promise<ProductType | HttpErrorType> {
    const response = await Store.apiRoot.productTypes().withKey({ key }).get().execute();
    return response.body;
  }

  static async getAttributeOfProductType(
    attrName: string,
    key: ProductTypeKey,
  ): Promise<AttributePlainEnumValue[] | HttpErrorType> {
    const result = await this.getProductTypeByKey(key);

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

  @extractHttpError
  static async getProductBySlug(slug: string): Promise<ProductProjection | HttpErrorType> {
    const response = await Store.apiRoot
      .productProjections()
      .get({ queryArgs: { where: `slug(en-US="${slug}")` } })
      .execute();

    return response.body.results[0];
  }

  @extractHttpError
  static async searchProductsWithCategories(text: string): Promise<[ProductProjection[], Category[]] | HttpErrorType> {
    const response = await this.searchProducts(text);

    const textLowerCase = text.toLocaleLowerCase();

    const productsFiltered = response.results.filter((prod) =>
      prod.name[LANG_CODE].toLocaleLowerCase().includes(textLowerCase),
    );

    const categories = await this.getCategoryById(this.getFacetTerms(response.facets, 'categories.id'));

    const categoriesFiltered = categories.filter((category) =>
      category.name[LANG_CODE].toLocaleLowerCase().includes(textLowerCase),
    );

    return [productsFiltered, categoriesFiltered];
  }

  private static async searchProducts(text: string): Promise<ProductProjectionPagedSearchResponse> {
    const response = await Store.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          [`text.${LANG_CODE}`]: text,
          facet: 'categories.id',
          fuzzy: true,
          fuzzyLevel: text.length === 5 ? 2 : undefined,
          limit: searchResultsLimit,
        },
      })
      .execute();

    return response.body;
  }

  private static getFacetTerms(facets: FacetResults, field: string): string[] {
    const facetTerms = facets[field];

    if (!facetTerms) {
      throw new Error(`No such field "${field}" in provided facets`);
    }

    return (facetTerms as TermFacetResult)?.terms.map((t) => t.term as string);
  }

  private static async getCategoryById(ids: string[]): Promise<Category[]>;
  private static async getCategoryById(id: string): Promise<Category>;
  private static async getCategoryById(categoryId: string[] | string): Promise<Category[] | Category> {
    if (typeof categoryId === 'string') {
      return (await Store.apiRoot.categories().withId({ ID: categoryId }).get().execute()).body;
    }

    if (!categoryId.length) return [];

    return (
      await Store.apiRoot
        .categories()
        .get({ queryArgs: { where: categoryId.map((id) => `id="${id}"`).join(' or '), sort: 'orderHint asc' } })
        .execute()
    ).body.results;
  }
}

export default ProductRepoService;

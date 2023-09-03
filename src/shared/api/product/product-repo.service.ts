import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import {
  type ProductProjection,
  type Category,
  type ProductProjectionPagedSearchResponse,
  type LocalizedString,
} from '@commercetools/platform-sdk';
import { IFilters, ISortBy } from '@shared/interfaces';
import Store from '@app/store/store';
import { LANG_CODE } from '@shared/constants/misc';
import Product from '@components/entities/product/product';
import { ProductType } from '@commercetools/platform-sdk';
import { getFacetTerms } from './helpers';
import extractHttpError from '../extract-http-error.decorator';
import { filterQueryBuilder } from './filter-query-builder';
import { searchResultsLimit } from './config';

class ProductRepoService {
  @extractHttpError
  static async getProductsByCategory(
    categoryId: string,
    facets?: string[],
  ): Promise<ProductProjectionPagedSearchResponse | HttpErrorType> {
    const response = await Store.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: `categories.id:"${categoryId}"`,
          facet: facets,
          'filter.facets': `categories.id:"${categoryId}"`,
          expand: 'categories[*]',
        },
      })
      .execute();

    return response.body;
  }

  @extractHttpError
  static async getProductsByProductType(
    productTypeId: string,
    facets?: string[],
  ): Promise<ProductProjectionPagedSearchResponse | HttpErrorType> {
    const response = await Store.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: `productType.id:"${productTypeId}"`,
          facet: facets,
          'filter.facets': `productType.id:"${productTypeId}"`,
          expand: ['categories[*]', 'productType'],
        },
      })
      .execute();

    return response.body;
  }

  @extractHttpError
  static async getCategories(): Promise<Category[] | HttpErrorType> {
    const response = await Store.apiRoot.categories().get().execute();
    return response.body.results;
  }

  @extractHttpError
  static async getProductTypeByKey(key: string): Promise<ProductType | HttpErrorType> {
    const response = await Store.apiRoot.productTypes().withKey({ key }).get().execute();
    return response.body;
  }

  @extractHttpError
  static async getProductsWithFilter(
    filters: IFilters,
    facet: string[],
    sortConfig?: ISortBy,
  ): Promise<ProductProjectionPagedSearchResponse | HttpErrorType> {
    const query = this.buildFilterQuery(filters);

    const sort = sortConfig ? `${sortConfig.type} ${sortConfig.direction}` : undefined;

    const response = await Store.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: query,
          expand: ['categories[*]', 'productType'],
          facet,
          'filter.facets': query,
          sort,
        },
      })
      .execute();

    return response.body;
  }

  private static buildFilterQuery(filters: IFilters): string[] {
    return Object.entries(filters).reduce((acc, [name, filter]) => {
      if (!filter || !Object.keys(filter).length) {
        return acc;
      }

      acc.push(filterQueryBuilder[name](filter));

      return acc;
    }, [] as string[]);
  }

  @extractHttpError
  static async getProductBySlug(slug: string): Promise<ProductProjection | HttpErrorType> {
    const response = await Store.apiRoot
      .productProjections()
      .get({ queryArgs: { where: `slug(en-US="${slug}")`, expand: ['categories[*]', 'productType'] } })
      .execute();

    return response.body.results[0];
  }

  @extractHttpError
  static async searchProductsWithCategories(text: string): Promise<[Product[], Category[]] | HttpErrorType> {
    const response = await this.searchProducts(text);
    const categories = await this.getCategoryById(getFacetTerms(response.facets, 'categories.id') ?? []);

    const filter = this.nameMatchFilter.bind(null, text);

    const productsFiltered = response.results.filter(filter).map((p) => new Product(p));
    const categoriesFiltered = categories.filter(filter);

    return [productsFiltered, categoriesFiltered];
  }

  private static nameMatchFilter<T extends { name: LocalizedString }>(text: string, item: T): boolean {
    return item.name[LANG_CODE].toLocaleLowerCase().includes(text.toLocaleLowerCase());
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
          expand: ['categories[*]', 'productType'],
        },
      })
      .execute();

    return response.body;
  }

  @extractHttpError
  static async getCategoryBySlug(slug: string): Promise<Category | HttpErrorType | null> {
    const response = await Store.apiRoot
      .categories()
      .get({ queryArgs: { where: `slug(en-US="${slug}")` } })
      .execute();

    return response.body.results[0] ?? null;
  }

  static async getProductTypeById(ids: string[]): Promise<ProductType[]>;
  static async getProductTypeById(id: string): Promise<ProductType>;
  static async getProductTypeById(typeId: string[] | string): Promise<ProductType[] | ProductType> {
    if (typeof typeId === 'string') {
      return (await Store.apiRoot.productTypes().withId({ ID: typeId }).get().execute()).body;
    }

    if (!typeId.length) return [];

    return (
      await Store.apiRoot
        .productTypes()
        .get({ queryArgs: { where: typeId.map((id) => `id="${id}"`).join(' or ') } })
        .execute()
    ).body.results;
  }

  static async getCategoryById(ids: string[]): Promise<Category[]>;
  static async getCategoryById(id: string): Promise<Category>;
  static async getCategoryById(categoryId: string[] | string): Promise<Category[] | Category> {
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

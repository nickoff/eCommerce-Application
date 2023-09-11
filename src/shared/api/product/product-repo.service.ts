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
import extractHttpError from '../extract-http-error.decorator';
import { filterQueryBuilder } from './filter-query-builder';
import { searchResultsLimit } from './config';

class ProductRepoService {
  @extractHttpError
  static async getProductsByCategory(
    categoryId: string,
    facets?: string[],
    page?: number,
  ): Promise<ProductProjectionPagedSearchResponse | HttpErrorType> {
    return Store.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: `categories.id:"${categoryId}"`,
          facet: facets,
          'filter.facets': `categories.id:"${categoryId}"`,
          expand: ['categories[*]', 'productType'],
          limit: searchResultsLimit,
          offset: page ? searchResultsLimit * (page - 1) : undefined,
        },
      })
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getProductsByProductType(
    productTypeId: string,
    facets?: string[],
    page?: number,
  ): Promise<ProductProjectionPagedSearchResponse | HttpErrorType> {
    return Store.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: `productType.id:"${productTypeId}"`,
          facet: facets,
          'filter.facets': `productType.id:"${productTypeId}"`,
          expand: ['categories[*]', 'productType'],
          limit: searchResultsLimit,
          offset: page ? searchResultsLimit * (page - 1) : undefined,
        },
      })
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getCategories(): Promise<Category[] | HttpErrorType> {
    return Store.apiRoot
      .categories()
      .get()
      .execute()
      .then(({ body }) => body.results);
  }

  @extractHttpError
  static async getProductTypeByKey(key: string): Promise<ProductType | HttpErrorType> {
    return Store.apiRoot
      .productTypes()
      .withKey({ key })
      .get()
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getProductsWithFilter(
    filters: IFilters,
    facet: string[],
    sortConfig?: ISortBy,
    page?: number,
  ): Promise<ProductProjectionPagedSearchResponse | HttpErrorType> {
    const query = this.buildFilterQuery(filters);

    const sort = sortConfig ? `${sortConfig.type} ${sortConfig.direction}` : undefined;

    return Store.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: query,
          expand: ['categories[*]', 'productType'],
          facet,
          'filter.facets': query,
          sort,
          limit: searchResultsLimit,
          offset: page ? searchResultsLimit * (page - 1) : undefined,
        },
      })
      .execute()
      .then(({ body }) => body);
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
    return Store.apiRoot
      .productProjections()
      .get({ queryArgs: { where: `slug(en-US="${slug}")`, expand: ['categories[*]', 'productType'] } })
      .execute()
      .then(({ body }) => body.results[0]);
  }

  @extractHttpError
  static async searchProductsWithCategories(
    text: string,
  ): Promise<[Product[], Category[], ProductType[]] | HttpErrorType> {
    const response = await this.searchProducts(text);

    const filter = this.nameMatchFilter.bind(null, text);

    const productsFiltered = response.results.filter(filter).map((p) => new Product(p));
    const vendors = this.getVendorSetOfProducts(productsFiltered);
    const types = this.getProductTypeSetOfProducts(productsFiltered);

    return [productsFiltered, vendors, types];
  }

  private static getVendorSetOfProducts(products: Product[]): Category[] {
    return products.reduce<Category[]>((acc, prod) => {
      if (!acc.find((v) => v.name[LANG_CODE] === prod.vendor.name[LANG_CODE])) {
        acc.push(prod.vendor);
      }

      return acc;
    }, []);
  }

  private static getProductTypeSetOfProducts(products: Product[]): ProductType[] {
    return products.reduce<ProductType[]>((acc, prod) => {
      if (!acc.find((pt) => pt.name === prod.productType.name)) {
        acc.push(prod.productType);
      }

      return acc;
    }, []);
  }

  private static nameMatchFilter<T extends { name: LocalizedString }>(text: string, item: T): boolean {
    return item.name[LANG_CODE].toLocaleLowerCase().includes(text.toLocaleLowerCase());
  }

  private static async searchProducts(text: string): Promise<ProductProjectionPagedSearchResponse> {
    return Store.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          [`text.${LANG_CODE}`]: text,
          fuzzy: true,
          fuzzyLevel: text.length === 5 ? 2 : undefined,
          limit: searchResultsLimit,
          expand: ['categories[*]', 'productType'],
        },
      })
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getCategoryBySlug(slug: string): Promise<Category | HttpErrorType | null> {
    return Store.apiRoot
      .categories()
      .get({ queryArgs: { where: `slug(en-US="${slug}")` } })
      .execute()
      .then(({ body }) => body.results[0] ?? null);
  }

  static async getProductTypeById(ids: string[]): Promise<ProductType[]>;
  static async getProductTypeById(id: string): Promise<ProductType>;
  static async getProductTypeById(typeId: string[] | string): Promise<ProductType[] | ProductType> {
    if (typeof typeId === 'string') {
      return Store.apiRoot
        .productTypes()
        .withId({ ID: typeId })
        .get()
        .execute()
        .then(({ body }) => body);
    }

    if (!typeId.length) return [];

    return Store.apiRoot
      .productTypes()
      .get({ queryArgs: { where: typeId.map((id) => `id="${id}"`).join(' or ') } })
      .execute()
      .then(({ body }) => body.results);
  }

  static async getCategoryById(ids: string[]): Promise<Category[]>;
  static async getCategoryById(id: string): Promise<Category>;
  static async getCategoryById(categoryId: string[] | string): Promise<Category[] | Category> {
    if (typeof categoryId === 'string') {
      return Store.apiRoot
        .categories()
        .withId({ ID: categoryId })
        .get()
        .execute()
        .then(({ body }) => body);
    }

    if (!categoryId.length) return [];

    return Store.apiRoot
      .categories()
      .get({ queryArgs: { where: categoryId.map((id) => `id="${id}"`).join(' or '), sort: 'orderHint asc' } })
      .execute()
      .then(({ body }) => body.results);
  }
}

export default ProductRepoService;

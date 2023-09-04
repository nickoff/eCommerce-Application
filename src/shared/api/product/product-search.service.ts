/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import { isHttpErrorType, isKeyOf } from '@shared/utils/type-guards';
import { FacetResults, RangeFacetResult, Category, ProductType } from '@commercetools/platform-sdk';
import { IFilters, IRangeFilter, Color, ISortBy } from '@shared/interfaces';
import { centsToMoney } from '@shared/utils/misc';
import { FilterName } from '@shared/enums';
import { ICatalogData } from '@pages/catalog/catalog.interface';
import ProductRepoService from './product-repo.service';
import { getFacetTerms } from './helpers';

class ProductSearchService {
  private static facets = {
    [FilterName.Vendor]: 'variants.categories.id as vendors',
    [FilterName.Type]: 'productType.id as types',
    [FilterName.Color]: 'variants.attributes.color as colors',
    [FilterName.PriceRange]: 'variants.price.centAmount:range (0 to *) as priceRange',
  };

  static async fetchProductsByProductType(typeKey: string): Promise<ICatalogData | null> {
    const productType = await ProductRepoService.getProductTypeByKey(typeKey);

    if (isHttpErrorType(productType)) {
      return null;
    }

    const productsResp = await ProductRepoService.getProductsByProductType(
      productType.id,
      Object.values(this.facets).flat(),
    );

    if (isHttpErrorType(productsResp)) {
      return null;
    }

    const filters = (await this.buildFiltersFromFacets(productsResp.facets)) as IFilters;

    return {
      selectedFilters: { [FilterName.Type]: [productType] },
      products: productsResp.results,
      filters,
    };
  }

  static async fetchProductsByCategory(categorySlug: string): Promise<ICatalogData | null> {
    const vendorCategory = await ProductRepoService.getCategoryBySlug(categorySlug);

    if (!vendorCategory || isHttpErrorType(vendorCategory)) {
      return null;
    }

    const productsResp = await ProductRepoService.getProductsByCategory(
      vendorCategory.id,
      Object.values(this.facets).flat(),
    );

    if (isHttpErrorType(productsResp)) {
      return null;
    }

    const filters = (await this.buildFiltersFromFacets(productsResp.facets)) as IFilters;

    return {
      selectedFilters: { [FilterName.Vendor]: [vendorCategory] },
      products: productsResp.results,
      filters,
    };
  }

  static async fetchProductsWithFilters(
    filter: IFilters,
    lastFilter?: FilterName,
    sort?: ISortBy,
  ): Promise<ICatalogData | null> {
    const facetsToApply = Object.entries(this.facets).reduce((acc, [name, facet]) => {
      if (name !== lastFilter) {
        acc.push(facet);
      }

      return acc;
    }, [] as string[]);

    const priceRangeFacetIndex = facetsToApply.findIndex((s) => s.includes('variants.price.centAmount'));

    if (priceRangeFacetIndex >= 0 && filter.priceRange.min && filter.priceRange.max) {
      const facet = `variants.price.centAmount:range (${filter.priceRange.min * 100} to ${
        filter.priceRange.max * 100
      }) as priceRange`;
      facetsToApply.splice(priceRangeFacetIndex, 1, facet);
    }

    const response = await ProductRepoService.getProductsWithFilter(filter, facetsToApply, sort);

    if (isHttpErrorType(response)) {
      return null;
    }

    const filters = (await this.buildFiltersFromFacets(response.facets)) as IFilters;

    return {
      products: response.results,
      filters,
    };
  }

  private static async buildFiltersFromFacets(facets: FacetResults): Promise<Partial<IFilters>> {
    const vendors = await this.buildVendorFilterFromFacet(facets);
    const colors = this.buildColorFilterFromFacet(facets);
    const types = await this.buildTypeFilterFromFacet(facets);
    const priceRange = this.buildPriceRangeFilterFromFacet(facets);

    const result = { vendors, colors, types, priceRange };

    Object.keys(result).forEach((key) => {
      if (isKeyOf(result, key)) {
        if (result[key] === undefined) {
          delete result[key];
        }
      }
    });

    return result;
  }

  private static buildPriceRangeFilterFromFacet(facet: FacetResults): IRangeFilter | undefined {
    const priceRangeFacet = facet.priceRange;
    if (!priceRangeFacet) return undefined;

    let { min, max } = (priceRangeFacet as RangeFacetResult).ranges[0];

    min = centsToMoney(min);
    max = centsToMoney(max);

    return { min, max };
  }

  private static async buildVendorFilterFromFacet(facet: FacetResults): Promise<Category[] | undefined> {
    const vendorIds = getFacetTerms(facet, 'vendors');
    if (!vendorIds) return undefined;
    const vendors = await ProductRepoService.getCategoryById(vendorIds);
    return vendors;
  }

  private static async buildTypeFilterFromFacet(facet: FacetResults): Promise<ProductType[] | undefined> {
    const typesId = getFacetTerms(facet, 'types');
    if (!typesId) return undefined;
    const types = await ProductRepoService.getProductTypeById(typesId);
    return types;
  }

  private static buildColorFilterFromFacet(facets: FacetResults): Color[] | undefined {
    const colors = getFacetTerms(facets, 'colors');
    if (!colors) return undefined;
    return colors;
  }
}

export default ProductSearchService;

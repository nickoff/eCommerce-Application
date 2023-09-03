/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import { isHttpErrorType, isKeyOf } from '@shared/utils/type-guards';
import { FacetResults, RangeFacetResult, Category, ProductType } from '@commercetools/platform-sdk';
import { IFilters, IRangeFilter, Color } from '@shared/interfaces';
import { centsToMoney } from '@shared/utils/misc';
import { FilterName } from '@shared/enums';
import { ICatalogProps } from '@pages/catalog/catalog.interface';
import ProductRepoService from './product-repo.service';
import { getFacetTerms } from './helpers';

class ProductSearchService {
  private static facets = {
    [FilterName.Vendor]: 'variants.categories.id as vendors',
    [FilterName.Type]: 'productType.id as types',
    [FilterName.Color]: 'variants.attributes.color as colors',
    [FilterName.PriceRange]: 'variants.price.centAmount:range (0 to *) as priceRange',
  };

  static async fetchProductsByProductType(typeKey: string): Promise<ICatalogProps | null> {
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

  static async fetchProductsWithFilters(filter: IFilters, lastFilter?: FilterName): Promise<ICatalogProps | null> {
    const facetsToApply = Object.entries(this.facets).reduce((acc, [name, facet]) => {
      if (name !== lastFilter) {
        acc.push(facet);
      }

      return acc;
    }, [] as string[]);

    const response = await ProductRepoService.getProductsWithFilter(filter, facetsToApply);

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

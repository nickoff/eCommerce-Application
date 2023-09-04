import { Category, ProductType } from '@commercetools/platform-sdk';
import { FilterName } from '@shared/enums';

export interface IFilters {
  [FilterName.Vendor]: Category[];
  [FilterName.Type]: ProductType[];
  [FilterName.Color]: Color[];
  [FilterName.PriceRange]: IRangeFilter;
}

export interface IRangeFilter {
  min: number;
  max: number;
}

export type Color = string;

export interface ICategoriesFilter {
  vendors: Category[];
  types: Category[];
}

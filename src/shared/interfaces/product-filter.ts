import { ProductFilterType, ProductCategory } from '@shared/enums';

export interface IFilterBy {
  category: ProductCategory;
  [ProductFilterType.Vendor]?: string[];
  [ProductFilterType.Color]?: string[];
  [ProductFilterType.Price]?: { from: number; to: number };
}

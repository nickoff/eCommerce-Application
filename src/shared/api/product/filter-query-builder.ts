import { ProductCategoryId, ProductCategory, ProductFilterType } from '@shared/enums';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterQueryBuilder: Record<string, (k: any) => string> = {
  category: (category: ProductCategory) => `categories.id:"${ProductCategoryId[category]}"`,
  [ProductFilterType.Vendor]: (vendor: string) => `variants.attributes.vendor.key:${vendor}`,
  [ProductFilterType.Color]: (color: string) => `variants.attributes.color.key:${color}`,
};

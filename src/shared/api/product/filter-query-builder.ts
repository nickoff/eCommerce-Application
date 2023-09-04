import { FilterName } from '@shared/enums';
import { Category, ProductType } from '@commercetools/platform-sdk';
import { IRangeFilter } from '@shared/interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterQueryBuilder: Record<string, (k: any) => string> = {
  [FilterName.Type]: (types: ProductType[]) => `productType.id:${types.map((type) => `"${type.id}"`).join(', ')}`,

  [FilterName.Vendor]: (vendors: Category[]) => `categories.id:${vendors.map((cat) => `"${cat.id}"`).join(', ')}`,

  [FilterName.Color]: (colors: string[]) => `variants.attributes.color:${colors.map((col) => `"${col}"`).join(', ')}`,

  [FilterName.PriceRange]: ({ min: from, max: to }: IRangeFilter) =>
    `variants.price.centAmount:range (${from * 100} to ${to * 100})`,
};

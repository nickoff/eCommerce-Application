import { ProductProjection } from '@commercetools/platform-sdk';
import { IFilters } from '@shared/interfaces';

export interface ICatalogProps extends IProps {
  products: ProductProjection[];
  filters: IFilters;
  selectedFilters?: Partial<IFilters>;
}

import { ProductProjection } from '@commercetools/platform-sdk';
import { IFilters } from '@shared/interfaces';

export interface ICatalogProps extends IProps {
  catalogData: ICatalogData;
  pageTitle?: string;
  includeTypeFilter: boolean;
}

export interface ICatalogData {
  products: ProductProjection[];
  filters: IFilters;
  paginationData: {
    total: number;
    limit: number;
    offset: number;
  };
  selectedFilters?: Partial<IFilters>;
}

import { ProductCategory, ProductFilterType } from '@shared/enums';

export interface IFilterBlockProps extends IProps {
  filterType: ProductFilterType;
  category: ProductCategory;
}

export interface IFilterChangeEvtPayload {
  type: ProductFilterType;
  key: string;
  label: string;
  status: boolean;
}

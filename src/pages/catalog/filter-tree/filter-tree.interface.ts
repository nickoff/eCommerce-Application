import { ProductCategory } from '@shared/enums';
import { IFilterBy } from '@shared/interfaces';

export interface IFilterTreeProps extends IProps {
  category: ProductCategory;
  onFilterChange: (filter: IFilterBy) => void;
}

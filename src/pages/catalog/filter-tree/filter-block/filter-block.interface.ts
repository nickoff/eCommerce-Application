import { FilterName } from '@shared/enums';
import { FilterDataType } from '@shared/types';
import { FilterBlockType } from './filter-block.types';

export interface IFilterBlockProps extends IProps {
  type: FilterBlockType;
  filterData: FilterDataType;
  filterName: FilterName;
  heading: string;
}

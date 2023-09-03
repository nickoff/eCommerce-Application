import { IFilters } from '@shared/interfaces';
import { IFilterPayload } from './filter-block/filter-block.types';

export interface IFilterTreeProps extends IProps {
  filters: IFilters;
  appliedFilters?: Pick<IFilterPayload, 'filterLabel' | 'filterBlock'>[];
}

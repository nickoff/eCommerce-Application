import { SortDirection, SortType } from '@shared/enums';

export interface ISortBy {
  type: SortType;
  direction: SortDirection;
}

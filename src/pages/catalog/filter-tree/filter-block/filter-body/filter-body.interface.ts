import { Component } from '@shared/lib';
import { FilterDataType } from '@shared/types';
import { Category } from '@commercetools/platform-sdk';
import { Color, IRangeFilter } from '@shared/interfaces';
import FilterBlock from '../filter-block';
// eslint-disable-next-line import/no-cycle
import { IFilterPayload } from '../filter-block.types';

export interface IFilterBody extends Component {
  unselect<T extends IFilterPayload<Category & Color & IRangeFilter>>(payload: T): void;
}

export interface IFilterBodyProps<T extends FilterDataType> extends IProps {
  filterData: T;
  // appliedFilters:
  filterBlock: FilterBlock;
}

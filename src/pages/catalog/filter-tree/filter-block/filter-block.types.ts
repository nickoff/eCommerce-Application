import { IRangeFilter, Color } from '@shared/interfaces';
import { Category, ProductType } from '@commercetools/platform-sdk';
import FilterBlock from './filter-block';
// eslint-disable-next-line import/no-cycle
import { IFilterBody } from './filter-body/filter-body.interface';

export enum FilterBlockType {
  List = 'list',
  Pallete = 'pallete',
  Range = 'range',
}

export type FilterData = Category | Color | IRangeFilter | ProductType;

export enum FilterBlockEvent {
  FilterChange = 'filterblock:filterchange',
}

export interface IFilterPayload<T = unknown> {
  filter: T;
  filterLabel: string;
  filterBlock: FilterBlock;
  filterBody: IFilterBody;
  status: boolean;
}

export type ListChangeEvent = {
  type: FilterBlockType.List;
  payload: IFilterPayload<Category | ProductType>;
};

export type PalleteChangeEvent = {
  type: FilterBlockType.Pallete;
  payload: IFilterPayload<Color>;
};

export type RangeChangeEvent = {
  type: FilterBlockType.Range;
  payload: IFilterPayload<IRangeFilter>;
};

export type FilterChangeEvent = ListChangeEvent | PalleteChangeEvent | RangeChangeEvent;

declare global {
  interface GlobalEventHandlersEventMap {
    [FilterBlockEvent.FilterChange]: CustomEvent<FilterChangeEvent>;
  }
}

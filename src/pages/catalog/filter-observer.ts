import Observer from '@shared/lib/observer';
import { FilterName } from '@shared/enums';
import { FilterDataType } from '@shared/types';

export type FilterChangeEvtMap = {
  filterchange: { filterName: FilterName; fitlerData: FilterDataType };
};

export default new Observer<FilterChangeEvtMap>();

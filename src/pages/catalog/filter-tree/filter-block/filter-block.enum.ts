import { IFilterChangeEvtPayload } from './filter-block.interface';

export enum FilterBlockEvent {
  FilterChange = 'filterblock:filterchange',
}

declare global {
  interface GlobalEventHandlersEventMap {
    [FilterBlockEvent.FilterChange]: CustomEvent<{ filter: IFilterChangeEvtPayload }>;
  }
}

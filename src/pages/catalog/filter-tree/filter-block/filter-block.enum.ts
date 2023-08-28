import { IFilterChangeEvtPayload, IPriceChangeEvtPayload } from './filter-block.interface';

export enum FilterBlockEvent {
  FilterChange = 'filterblock:filterchange',
  PriceChange = 'filterblock:pricechange',
}

declare global {
  interface GlobalEventHandlersEventMap {
    [FilterBlockEvent.FilterChange]: CustomEvent<{ filter: IFilterChangeEvtPayload }>;
    [FilterBlockEvent.PriceChange]: CustomEvent<IPriceChangeEvtPayload>;
  }
}

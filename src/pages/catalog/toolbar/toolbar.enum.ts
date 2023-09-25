import { ISortBy } from '@shared/interfaces';

export enum CardsLayout {
  List = 'list',
  Grid = 'grid',
}

export enum ToolbarEvent {
  LayoutChange = 'toolbar:layoutchange',
  SoringChange = 'toolbar:sortingchange',
  FilterOpen = 'toolbar:filteropen',
}

declare global {
  interface GlobalEventHandlersEventMap {
    [ToolbarEvent.LayoutChange]: CustomEvent<{ layout: CardsLayout }>;
    [ToolbarEvent.SoringChange]: CustomEvent<ISortBy>;
  }
}

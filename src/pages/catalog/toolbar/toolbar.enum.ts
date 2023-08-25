export enum CardsLayout {
  List = 'list',
  Grid = 'grid',
}

export enum ToolbarEvent {
  LayoutChange = 'toolbar:layoutchange',
}

declare global {
  interface GlobalEventHandlersEventMap {
    [ToolbarEvent.LayoutChange]: CustomEvent<{ layout: CardsLayout }>;
  }
}

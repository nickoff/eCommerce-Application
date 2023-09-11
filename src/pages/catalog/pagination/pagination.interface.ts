export interface IPaginationProps extends IProps {
  limit: number;
  offset: number;
  total: number;
}

export const PAGE_CHANGE_EVENT = 'pagination:pagechange';

declare global {
  interface GlobalEventHandlersEventMap {
    [PAGE_CHANGE_EVENT]: CustomEvent<{ page: number }>;
  }
}

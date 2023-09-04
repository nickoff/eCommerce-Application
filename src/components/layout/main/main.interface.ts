import { Component } from '@shared/lib';

export interface IMainProps extends IProps {
  page: Component;
  showBreadcrumps: boolean;
  breadcrumpsPath?: { link: string; label: string }[];
}

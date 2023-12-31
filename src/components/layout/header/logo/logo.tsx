import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Route } from '@app/router';
import * as s from './logo.module.scss';

import LogoIcon from './logo-icon.element.svg';

export default function Logo({ className }: IProps): JSX.Element {
  return (
    <a href={Route.Home} className={cx(s.logo, className)} dataset={{ navigo: '' }}>
      {LogoIcon.cloneNode(true)}
    </a>
  );
}

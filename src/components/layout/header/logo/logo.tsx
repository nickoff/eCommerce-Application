import { element } from 'tsx-vanilla';
import cx from 'clsx';
import Routes from '@app/router/routes';
import s from './logo.module.scss';

import LogoIcon from './logo-icon.svg';

export default function Logo({ className }: IProps): JSX.Element {
  return (
    <a href={Routes.Home} className={cx(s.logo, className, 'nav-link')} attributes={{ 'data-navigo': '' }}>
      {LogoIcon}
    </a>
  );
}

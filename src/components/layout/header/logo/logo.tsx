import { element } from 'tsx-vanilla';
import cx from 'clsx';
import s from './logo.module.scss';

import LogoIcon from './logo-icon.svg';

export default function Logo({ className }: IProps): JSX.Element {
  return (
    <a href="home" className={cx(s.logo, className, 'nav-link')} attributes={{ 'data-navigo': '' }}>
      {LogoIcon}
    </a>
  );
}

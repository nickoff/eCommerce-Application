import { element } from 'tsx-vanilla';
import './logo.scss';

import LogoIcon from './logo-icon.svg';

export default function Logo({ className = '' }: IProps): JSX.Element {
  return (
    <a href="#" className={`logo ${className}`}>
      {LogoIcon}
    </a>
  );
}

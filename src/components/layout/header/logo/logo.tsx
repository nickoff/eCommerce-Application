import { element } from 'tsx-vanilla';
import './logo.scss';

import { SITE_TITLE } from '@shared/constants/seo';

export default function Logo({ className = '' }: IProps): JSX.Element {
  return (
    <a href="#" className={`logo ${className}`}>
      {SITE_TITLE}
    </a>
  );
}

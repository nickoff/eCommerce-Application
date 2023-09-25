import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';

import * as s from './footer-site-nav.module.scss';
import { linksConfig } from './config';
import { navItem } from '../../header/common.module.scss';

class FooterSiteNav extends Component {
  render(): JSX.Element {
    return (
      <ul className={s.footerSiteNavList}>
        {linksConfig.map((link) => (
          <li className={cx('nav-item', navItem)}>
            <a className={cx('nav-link', s.footerSiteNavLink)} href={link.route} dataset={{ navigo: '' }}>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

export default FooterSiteNav;

import { element } from 'tsx-vanilla';
import cx from 'clsx';
import Component from '@shared/component';

import 'bootstrap/js/dist/collapse';

import { SharedCSSClass } from '@shared/constants/shared-css-class';
import s from './header.module.scss';
import SiteNav from './site-nav/site-nav';
import UserNav from './user-nav/user-nav';
import Logo from './logo/logo';
import Hamburger from './hamburger/hamburger';

class Header extends Component {
  render(): JSX.Element {
    return (
      <div className={s.headerWrapper}>
        <header className={cx(s.header, SharedCSSClass.Container)}>
          <Hamburger className={s.headerHamburger} />
          <Logo className={s.headerLogo} />
          {new SiteNav({ className: s.headerSiteNav }).render()}
          {new UserNav({ className: s.headerUserNav }).render()}
        </header>
      </div>
    );
  }
}

export default Header;

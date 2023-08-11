import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import './header.scss';

import { SharedCSSClass } from '@shared/constants/shared-css-class';
import SiteNav from './site-nav/site-nav';
import UserNav from './user-nav/user-nav';
import Logo from './logo/logo';

class Header extends Component {
  render(): JSX.Element {
    return (
      <div className="header-wrapper">
        <header className={`header ${SharedCSSClass.Container}`}>
          <Logo className="header__logo" />
          {new SiteNav({ className: 'header__site-nav' }).render()}
          {new UserNav({ className: 'header__user-nav' }).render()}
        </header>
      </div>
    );
  }
}

export default Header;

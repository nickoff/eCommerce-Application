import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Child, Component } from '@shared/lib';
import { qs } from '@shared/utils/dom-helpers';
import * as bs from 'bootstrap';
import { MouseEvtName } from '@shared/constants/events';
import { padDot } from '@shared/utils/misc';
import { isElement } from '@shared/utils/type-guards';
import * as s from './header.module.scss';
import { container } from '../../../styles/shared/index.module.scss';
import SiteNav from './site-nav/site-nav';
import UserNav from './user-nav/user-nav';
import Logo from './logo/logo';
import Hamburger from './hamburger/hamburger';

class Header extends Component {
  @Child(s.headerSiteNav) siteNav!: HTMLElement;

  private navBarToggle!: bs.Collapse;

  protected componentDidRender(): void {
    this.navBarToggle = new bs.Collapse(qs('#n-bar', this.getContent()));
    document.addEventListener(MouseEvtName.CLICK, ({ target }) => {
      if (isElement(target) && target.closest(padDot(s.headerWrapper))) {
        return;
      }

      this.navBarToggle.hide();
    });
  }

  render(): JSX.Element {
    return (
      <div className={s.headerWrapper}>
        <header className={cx(s.header, container)}>
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

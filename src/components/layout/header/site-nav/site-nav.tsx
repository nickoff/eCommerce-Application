import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';

import { MouseEvtName } from '@shared/constants/events';
import { delegate } from '@shared/utils/dom-helpers';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import * as s from './site-nav.module.scss';
import { linksConfig } from './config';
import { navItem } from '../common.module.scss';

class SiteNav extends Component {
  render(): JSX.Element {
    return (
      <nav className={cx('navbar', 'navbar-expand-nav-hide', s.siteNav, this.props.className)}>
        <div className="collapse navbar-collapse" id="n-bar">
          <ul className={cx('navbar-nav', s.siteNavList)}>
            {linksConfig.map((link) => (
              <li className={cx('nav-item', navItem, s.siteNavItem)}>
                <a className={cx('nav-link', s.siteNavLink)} href={link.route} dataset={{ navigo: '' }}>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  protected componentDidRender(): void {
    delegate(this.getContent(), s.siteNavLink, MouseEvtName.CLICK, this.changeActiveLink.bind(this));
  }

  private changeActiveLink(clickedLink: Element): void {
    assertIsHTMLElement(clickedLink);

    const { isActive } = clickedLink.dataset;

    if (isActive) {
      return;
    }

    const activeLink = this.getContent().querySelector<HTMLElement>('[data-active]');

    if (activeLink) {
      activeLink.removeAttribute('data-active');
    }

    clickedLink.setAttribute('data-active', '');
  }
}

export default SiteNav;

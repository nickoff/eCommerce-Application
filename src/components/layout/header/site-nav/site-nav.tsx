import { element } from 'tsx-vanilla';
import cx from 'clsx';
import Component from '@shared/component';

import { MouseEvtName } from '@shared/constants/events';
import { delegate } from '@shared/utils/dom-helpers';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import s from './site-nav.module.scss';
import { linksConfig } from './config';

class SiteNav extends Component {
  render(): JSX.Element {
    return (
      <nav className={cx('navbar', 'navbar-expand-md', s.siteNav, this.props.className)}>
        <div className="collapse navbar-collapse" id="n-bar">
          <ul className={cx('navbar-nav', s.siteNavList)}>
            {linksConfig.map((link) => (
              <li className={cx('nav-item', s.siteNavItem)}>
                <a className={cx('nav-link', s.siteNavLink)} href={link.route} attributes={{ 'data-navigo': '' }}>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  componentDidRender(): void {
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

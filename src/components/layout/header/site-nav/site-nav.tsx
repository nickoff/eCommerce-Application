import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import './site-nav.scss';

import { MouseEvtName } from '@shared/constants/events';
import { delegate } from '@shared/utils/dom-helpers';
import { assertIsHTMLElement } from '@shared/utils/type-guards';
import { linksConfig } from './config';

class SiteNav extends Component {
  render(): JSX.Element {
    return (
      <nav className="site-nav">
        <ul className="site-nav__list">
          {linksConfig.map((link) => (
            <li className="site-nav__item">
              <a className="site-nav__link" href={link.route}>
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  componentDidRender(): void {
    delegate(this.getContent(), 'site-nav__link', MouseEvtName.CLICK, this.changeActiveLink.bind(this));
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

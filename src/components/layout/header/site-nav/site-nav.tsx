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
      <nav className={`navbar navbar-expand-md site-nav ${this.props.className ?? ''}`}>
        <div className="collapse navbar-collapse" id="n-bar">
          <ul className="navbar-nav site-nav__list">
            {linksConfig.map((link) => (
              <li className="nav-item site-nav__item">
                <a className="nav-link site-nav__link" href={link.route}>
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

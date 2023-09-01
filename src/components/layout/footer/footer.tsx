import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import { container } from '@styles/shared/index.module.scss';
import * as s from './footer.module.scss';
import SiteNav from '../header/site-nav/site-nav';
import Logo from '../header/logo/logo';
import FooterText from './config';

class Footer extends Component {
  render(): JSX.Element {
    return (
      <div className={s.footerWrapper}>
        <footer className={cx(s.footer, container)}>
          <span className={s.footerRectangle}></span>
          <div className={s.footerTitle}>
            <Logo />
            {new SiteNav().render()}
          </div>
          <div className={s.footerTwoColumn}>
            <div className={s.footerContent}>
              <p>{FooterText.Description}</p>
              <p>{FooterText.Copyright}</p>
            </div>
            <ul className={s.footerSocial}>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;

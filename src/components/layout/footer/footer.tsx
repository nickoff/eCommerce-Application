import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import { container } from '@styles/shared/index.module.scss';
import FacebookIcon from '@assets/icons/facebook.element.svg';
import TwitterIcon from '@assets/icons/twitter.element.svg';
import InstagramIcon from '@assets/icons/instagram.element.svg';
import * as s from './footer.module.scss';
import Logo from '../header/logo/logo';
import { FooterSocialLink, FooterText } from './config';
import FooterSiteNav from './footer-site-nav/footer-site-nav';

class Footer extends Component {
  render(): JSX.Element {
    return (
      <div className={s.footerWrapper}>
        <footer className={cx(s.footer, container)}>
          <span className={s.footerRectangle}></span>
          <div className={s.footerTitle}>
            <Logo />
            {new FooterSiteNav().render()}
          </div>
          <div className={s.footerTwoColumn}>
            <div className={s.footerContent}>
              <p>{FooterText.Description}</p>
              <p>{FooterText.Copyright}</p>
            </div>
            <ul className={s.footerSocial}>
              <li>
                <a href={FooterSocialLink.Facebook}>{FacebookIcon}</a>
              </li>
              <li>
                <a href={FooterSocialLink.Twitter}>{TwitterIcon}</a>
              </li>
              <li>
                <a href={FooterSocialLink.Instagram}>{InstagramIcon}</a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;

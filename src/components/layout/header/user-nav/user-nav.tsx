import { element, fragment } from 'tsx-vanilla';
import cx from 'clsx';
import Component from '@shared/component';
import Store from '@app/store';
import { Route } from '@app/router';
import { btn, btnFilled } from '../../../../styles/shared/button-like.module.scss';
import { navItem, navLink } from '../common.module.scss';
import * as s from './user-nav.module.scss';
import CartIcon from './assets/cart-icon.svg';
import UserMenu from './user-menu/user-menu';

class UserNav extends Component {
  constructor(...args: IProps[]) {
    super(...args);
    Store.getInstance().subscribe('customer', this);
  }

  render(): JSX.Element {
    const { customer } = Store.getInstance().getState();

    return (
      <nav>
        <ul className={s.navList}>
          <li className={cx(navItem, s.userNavItem)}>
            <button className={navLink}>{CartIcon}</button>
          </li>
          {customer ? new UserMenu({ className: s.userNavItem }).render() : this.renderAuthLinks()}
        </ul>
      </nav>
    );
  }

  private renderAuthLinks(): JSX.Element {
    return (
      <>
        <li className={cx(navItem, s.signUpItem, 'p-0')}>
          <a className={cx(btn, btnFilled)} href={Route.Registration} dataset={{ navigo: '' }}>
            SIGN UP
          </a>
        </li>
        <li className={cx(navItem, s.signInItem, s.userNavItem, 'p-0')}>
          <a className={cx(btn, s.signInLink)} href={Route.Login} dataset={{ navigo: '' }}>
            SIGN IN
          </a>
        </li>
      </>
    );
  }
}

export default UserNav;

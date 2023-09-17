import { element, fragment } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import Store from '@app/store/store';
import { Route } from '@app/router';
import { btn, btnFilled } from '../../../../styles/shared/button-like.module.scss';
import { navItem, navLink } from '../common.module.scss';
import * as s from './user-nav.module.scss';
import CartIcon from './assets/cart-icon.element.svg';
import UserIcon from './assets/profile-icon.element.svg';
import UserMenu from './user-menu/user-menu';
import SearchModal from '../search/search-bar';

class UserNav extends Component {
  constructor(...args: IProps[]) {
    super(...args);
    Store.subscribe('customer', this);
    Store.subscribe('cart', this);
  }

  render(): JSX.Element {
    const { customer } = Store.getState();
    const { cart } = Store.getState();

    return (
      <nav>
        <ul className={s.navList}>
          <li className={cx(navItem, s.userNavItem)}>{new SearchModal().render()}</li>
          <li className={cx(navItem, s.userNavItem)}>
            <button className={navLink}>
              {CartIcon}
              {cart && cart?.lineItems.length ? (
                <span className={s.cartCount}>{cart?.lineItems.reduce((total, item) => total + item.quantity, 0)}</span>
              ) : (
                ''
              )}
            </button>
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
        <li className={cx('dropdown', s.authDropdown, navItem)}>
          <button
            className={cx('dropdown-toggle', navLink, s.dropdownToggle)}
            dataset={{ bsToggle: 'dropdown', bsOffset: '0,35' }}
          >
            {UserIcon.cloneNode(true)}
          </button>
          <ul className={cx('dropdown-menu', 'dropdown-menu-end')}>
            <li>
              <a className="dropdown-item" href={Route.Registration} dataset={{ navigo: '' }}>
                SIGN UP
              </a>
            </li>
            <li>
              <a className="dropdown-item" href={Route.Login} dataset={{ navigo: '' }}>
                SIGN IN
              </a>
            </li>
          </ul>
        </li>
      </>
    );
  }
}

export default UserNav;

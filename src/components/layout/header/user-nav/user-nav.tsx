import { element } from 'tsx-vanilla';
import cx from 'clsx';
import Component from '@shared/component';
import { Store } from '@app/store';
import 'bootstrap/js/dist/dropdown';
import s from './user-nav.module.scss';
import CartIcon from './assets/cart-icon.svg';
import UserIcon from './assets/profile-icon.svg';
import UserDropdownMenu from './user-menu/user-menu';

class UserNav extends Component {
  constructor(...args: IProps[]) {
    super(...args);
    Store.getInstance().subscribe('customer', this);
  }

  render(): JSX.Element {
    return (
      <nav>
        <ul className={s.userNavList}>
          <li className={s.userNavItem}>
            <button className={s.userNavLink}>{CartIcon}</button>
          </li>
          <li className={cx('dropdown', s.userNavItem)}>
            <button
              className={cx('dropdown-toggle', s.userNavLink, s.userMenuToggle)}
              dataset={{ bsToggle: 'dropdown', bsOffset: '4,30' }}
            >
              {UserIcon}
            </button>
            {new UserDropdownMenu().render()}
          </li>
        </ul>
      </nav>
    );
  }
}

export default UserNav;

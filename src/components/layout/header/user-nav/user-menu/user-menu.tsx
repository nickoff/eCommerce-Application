import { element } from 'tsx-vanilla';
import cx from 'clsx';
import Component from '@shared/component';
import { Store } from '@app/store';
import AuthService from '@app/auth.service';
import { anonymConfig } from './user-menu.config';
import s from './user-menu.module.scss';

class UserDropdownMenu extends Component {
  constructor() {
    super();
    Store.getInstance().subscribe('customer', this);
  }

  render(): JSX.Element {
    const { customer } = Store.getInstance().getState();
    return (
      <ul className={cx('dropdown-menu', 'dropdown-menu-end', s.userMenuDropdown)}>
        {customer ? (
          <li>
            <div>{`Hello ${customer.firstName} ${customer.lastName}`}</div>
            <button className={cx('dropdown-item', s.userMenuDropdownItem)} onclick={(): void => AuthService.logout()}>
              Log Out
            </button>
          </li>
        ) : (
          anonymConfig.map((item) => (
            <li className={cx('dropdown-item', s.userMenuDropdownItem)}>
              <a className={s.userMenuDropdownLink} href={item.href} attributes={{ 'data-navigo': '' }}>
                {item.text}
              </a>
            </li>
          ))
        )}
      </ul>
    );
  }
}

export default UserDropdownMenu;

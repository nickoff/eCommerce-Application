import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { Store } from '@app/store';
import AuthService from '@app/auth.service';
import { anonymConfig } from './user-menu.config';
import './user-menu.scss';

class UserDropdownMenu extends Component {
  constructor() {
    super();
    Store.getInstance().subscribe('customer', this);
  }

  render(): JSX.Element {
    const { customer } = Store.getInstance().getState();
    return (
      <ul className="dropdown-menu dropdown-menu-end user-menu__dropdown">
        {customer ? (
          <li>
            <div>{`Hello ${customer.firstName} ${customer.lastName}`}</div>
            <button className="dropdown-item user-menu__dropdown-item" onclick={(): void => AuthService.logout()}>
              Log Out
            </button>
          </li>
        ) : (
          anonymConfig.map((item) => (
            <li>
              <button className="dropdown-item user-menu__dropdown-item" onclick={item.onclick}>
                {item.text}
              </button>
            </li>
          ))
        )}
      </ul>
    );
  }
}

export default UserDropdownMenu;

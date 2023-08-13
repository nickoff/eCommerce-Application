import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import './user-nav.scss';
import 'bootstrap/js/dist/dropdown';
import { Store } from '@app/store';

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
      <nav className="user-nav">
        <ul className="user-nav__list">
          <li className="user-nav__item">
            <button className="user-nav__link">{CartIcon}</button>
          </li>
          <li className="dropdown user-nav__item user-menu">
            <button
              className="dropdown-toggle user-nav__link user-menu__toggle"
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

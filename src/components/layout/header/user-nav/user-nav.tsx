import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import './user-nav.scss';
import 'bootstrap/js/dist/dropdown';

import CartIcon from './assets/cart-icon.svg';
import UserIcon from './assets/profile-icon.svg';

class UserNav extends Component {
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
            <ul className="dropdown-menu dropdown-menu-end user-menu__dropdown">
              <li>
                <a href="#" className="dropdown-item user-menu__dropdown-item">
                  Sign In
                </a>
              </li>
              <li>
                <a href="#" className="dropdown-item user-menu__dropdown-item">
                  Sign Up
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    );
  }
}

export default UserNav;

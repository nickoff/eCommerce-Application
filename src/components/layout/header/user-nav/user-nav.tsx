import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import './user-nav.scss';

import CartIcon from './assets/cart-icon.svg';
import UserIcon from './assets/profile-icon.svg';

class UserNav extends Component {
  render(): JSX.Element {
    return (
      <nav className="user-nav">
        <ul className="user-nav__list">
          <li className="user-nav__item">
            <a className="user-nav__link" href="#">
              {CartIcon}
            </a>
          </li>
          <li className="user-nav__item">
            <button className="user-nav__btn">{UserIcon}</button>
          </li>
        </ul>
      </nav>
    );
  }
}

export default UserNav;

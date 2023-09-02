import { Component } from '@shared/lib';
import { element } from 'tsx-vanilla';
import { userProfileLinks } from './config';
import * as s from './userProfileNav.module.scss';

class UserProfileNav extends Component {
  render(): JSX.Element {
    return (
      <ul className={s.userProfileNavList}>
        {userProfileLinks.map((link) => (
          <li>
            <a href={link.route}>{link.text}</a>
          </li>
        ))}
      </ul>
    );
  }
}

export default UserProfileNav;

import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import Store from '@app/store/store';
import * as bs from 'bootstrap';
import { qs } from '@shared/utils/dom-helpers';
import { router, Route } from '@app/router';
import AuthService from '@app/auth.service';
import * as s from './user-menu.module.scss';
import { btn, btnFilled } from '../../../../../styles/shared/index.module.scss';
import { navItem, navLink } from '../../common.module.scss';
import UserIcon from '../assets/profile-icon.element.svg';

class UserMenu extends Component {
  private dropdown!: bs.Dropdown;

  protected componentDidRender(): void {
    this.dropdown = new bs.Dropdown(qs('.dropdown-toggle', this.getContent()));
  }

  render(): JSX.Element {
    const { customer } = Store.getState();

    return (
      <li className={cx('dropdown', navItem)}>
        <button
          className={cx('dropdown-toggle', navLink, s.dropdownToggle)}
          dataset={{ bsToggle: 'dropdown', bsOffset: '0,35', bsAutoClose: 'outside' }}
        >
          {UserIcon.cloneNode(true)}
        </button>
        <div className={cx('dropdown-menu', 'dropdown-menu-end', s.menuContainer)}>
          <div className={s.menuWrapper}>
            <p className={s.emailPara}>{customer?.email}</p>
            <button className={cx(btn, btnFilled, s.logProfileBtn)} onclick={this.onProfileClick.bind(this)}>
              PROFILE
            </button>
            <button className={cx(btn, btnFilled, s.logOutBtn)} onclick={this.onLogOutClick.bind(this)}>
              LOG OUT
            </button>
          </div>
        </div>
      </li>
    );
  }

  private onProfileClick(): void {
    this.dropdown.hide();
    router.navigate(Route.UserProfile);
  }

  private onLogOutClick(): void {
    this.dropdown.hide();
    AuthService.logout();
    router.navigate(Route.Home);
  }
}

export default UserMenu;

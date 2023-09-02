import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import * as s from './userAccount.module.scss';
import { UserAccountText } from './config';
import UserProfileNav from '../userProfileNav/userProfileNav';

class UserAccount extends Component {
  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h1>{UserAccountText.Title}</h1>
        {new UserProfileNav().render()}
        <form className={s.form}>
          <div className={s.userSettings}></div>
        </form>
      </div>
    );
  }
}

export default UserAccount;

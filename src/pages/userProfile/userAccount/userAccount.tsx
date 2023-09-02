import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import { render } from '@shared/utils/misc';
import { btn, btnFilled } from '@styles/shared/index.module.scss';
import * as s from './userAccount.module.scss';
import { controls as c, UserAccountText } from './config';
import UserProfileNav from '../userProfileNav/userProfileNav';

class UserAccount extends Component {
  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h1>{UserAccountText.Title}</h1>
        {new UserProfileNav({ className: s.activLink }).render()}
        <div className={s.pageLayout}>
          <h2>{UserAccountText.Subtitle}</h2>
          <form className={s.form}>
            <div className={s.accountSettings}>
              {render(
                c.firstName.class(s.firstName),
                c.lastName.class(s.lastName),
                c.email.class(s.email),
                c.dateOfBirth.class(s.birth),
                c.phone.class(s.phone),
                c.password.class(s.pwd),
                c.passwordConfirm.class(s.pwdConfirm),
              )}
            </div>
            <button className={cx(btn, btnFilled, s.submitBtn)} type="submit">
              {UserAccountText.BtnSubmit}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default UserAccount;

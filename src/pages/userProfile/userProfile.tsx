import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import Store from '@app/store/store';
import { render } from '@shared/utils/misc';
import * as s from './userProfile.module.scss';
import { controls as c } from './config';

class UserProfile extends Component {
  private inputs: NodeListOf<HTMLInputElement>;

  constructor() {
    super();
    this.inputs = document.querySelectorAll('input');
  }

  render(): JSX.Element {
    const { customer } = Store.getState();
    // eslint-disable-next-line no-console
    console.log(customer);
    return (
      <div className={s.pageWrapper}>
        <h1>User Profile</h1>
        <form>
          {render(
            c.firstName.class(s.firstName),
            c.lastName.class(s.lastName),
            c.email.class(s.email),
            c.password.class(s.pwd),
            c.passwordConfirm.class(s.pwdСonfirm),
            c.dateOfBirth.class(s.birth),
            c.phone.class(s.phone),
          )}
        </form>
      </div>
    );
  }

  private test(): void {
    // eslint-disable-next-line no-console
    console.log('!!!!!!!!!!!!!!!!!');
    this.inputs.forEach((el) => {
      el.addEventListener('click', () => {
        // eslint-disable-next-line no-console
        console.log(el);
      });
    });
  }
}

export default UserProfile;

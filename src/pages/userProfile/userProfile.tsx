/* eslint-disable no-console */
import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import Store from '@app/store/store';
import { render } from '@shared/utils/misc';
import { qsAll } from '@shared/utils/dom-helpers';
import { AddressType } from '@shared/enums/address.enum';
import * as s from './userProfile.module.scss';
import './userProfile.scss';
import { controls as c, newAdressControls } from './config';

class UserProfile extends Component {
  render(): JSX.Element {
    const { customer } = Store.getState();
    console.log(customer);

    return (
      <div className={s.pageWrapper}>
        <h1>User Profile</h1>
        <form className={s.userInfo}>
          <h2>User information</h2>
          {render(
            c.firstName.class(s.firstName),
            c.lastName.class(s.lastName),
            c.email.class(s.email),
            c.dateOfBirth.class(s.birth),
            c.password.class('hidden'),
            c.passwordConfirm.class('hidden'),
          )}
        </form>
        <form className={s.userInfo}>
          <h2>User address</h2>
          {render(newAdressControls(AddressType.Shipping))}
        </form>
        <form className={s.userInfo}>
          <h2>User address</h2>
          {render(newAdressControls(AddressType.Shipping))}
        </form>
      </div>
    );
  }

  protected componentDidRender(): void {
    const inputs = qsAll('input', this.getContent());
    const { customer } = Store.getState();

    if (!customer) return;

    const customerKeys = Object.keys(customer);
    const customerValues = Object.values(customer);

    inputs.forEach((el) => {
      if (!(el instanceof HTMLInputElement)) return;
      const input = el;
      input.readOnly = true;

      if (customerKeys.indexOf(input.name) !== -1) {
        const index = customerKeys.indexOf(input.name);
        input.value = customerValues[index];
      }
    });
  }

  private getCustomerData(): (string | undefined)[] | undefined {
    const { customer } = Store.getState();
    let tempArr;
    if (customer) {
      tempArr = [
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.dateOfBirth,
        customer.password,
        customer.password,
      ];
    }
    return tempArr;
  }
}
export default UserProfile;

/* eslint-disable no-console */
import { element } from 'tsx-vanilla';
import { Address } from '@commercetools/platform-sdk';
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
    if (!customer) return <div></div>;
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
        {this.insert(customer.addresses, customer.billingAddressIds)}
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

  private insert(addresses: Address[], billingAddressIds: string[] | undefined): JSX.Element {
    const temp = addresses.map((el) => {
      let typeAddres = AddressType.Shipping;

      if (el.id) {
        typeAddres = billingAddressIds?.includes(el.id) ? AddressType.Shipping : AddressType.Billing;
      }
      return (
        <form className={s.userInfo}>
          <h2>{typeAddres} Addres</h2>
          {render(newAdressControls(typeAddres))}
        </form>
      );
    });
    return <div>{temp}</div>;
  }
}
export default UserProfile;

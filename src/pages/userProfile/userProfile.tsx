/* eslint-disable no-console */
import { element } from 'tsx-vanilla';
import { Address, Customer } from '@commercetools/platform-sdk';
import { Component } from '@shared/lib';
import Store from '@app/store/store';
import { render } from '@shared/utils/misc';
import { qsAll } from '@shared/utils/dom-helpers';
import { AddressType } from '@shared/enums/address.enum';
import * as s from './userProfile.module.scss';
import './userProfile.scss';
import { controls as c, newAdressControls, UserPageText } from './config';

class UserProfile extends Component {
  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h1>User Profile</h1>
        <form className={s.userInfo}>
          <h2>User information</h2>
          {render(
            c.firstName,
            c.lastName,
            c.email,
            c.dateOfBirth,
            c.password.class('hidden'),
            c.passwordConfirm.class('hidden'),
          )}
        </form>
        {this.insertAddressForms()}
      </div>
    );
  }

  protected componentDidRender(): void {
    const forms = qsAll('[data-id]', this.getContent());

    const { customer } = Store.getState();
    if (!customer) return;

    this.showUserInfoForm(customer);
    this.showUserAddressForms(forms, customer.addresses);
  }

  private showUserInfoForm(customer: Customer): void {
    const inputs = qsAll('input', this.getContent());
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

  private showUserAddressForms(forms: HTMLElement[], addresses: Address[]): void {
    forms.forEach((el, index) => {
      const fields: HTMLInputElement[] = qsAll('select,input', el);

      fields[0].value = addresses[index].country;
      fields[1].value = addresses[index].city ?? '';
      fields[2].value = addresses[index].streetName ?? '';
      fields[3].value = addresses[index].postalCode ?? '';
    });
  }

  private insertAddressForms(): JSX.Element {
    const { customer } = Store.getState();
    if (!customer) throw Error(UserPageText.CustomerError);

    console.log(customer);

    const addressArray = customer.addresses.map((el) => {
      if (!el.id) throw Error(UserPageText.CustomerError);

      const typeAddres = customer.shippingAddressIds?.includes(el.id) ? AddressType.Shipping : AddressType.Billing;
      let defAddres = [customer.defaultBillingAddressId, customer.defaultShippingAddressId].includes(el.id)
        ? UserPageText.DefAddress
        : UserPageText.Empty;

      if (customer.shippingAddressIds?.includes(el.id) && customer.billingAddressIds?.includes(el.id))
        defAddres = UserPageText.GeneralAddress;

      const addressId = el.id;

      return (
        <form className={s.userInfo} dataset={{ id: addressId }}>
          <h2>{typeAddres} Addres</h2>
          <span className={s.defAddres}>{defAddres}</span>
          {render(newAdressControls(typeAddres))}
        </form>
      );
    });
    return <div>{addressArray}</div>;
  }
}
export default UserProfile;

/* eslint-disable no-console */
import { element } from 'tsx-vanilla';
import { Customer } from '@commercetools/platform-sdk';
import { buildFormData, isFormValid } from '@shared/utils/form-helpers';
import { Component } from '@shared/lib';
import Store from '@app/store/store';
import { render } from '@shared/utils/misc';
import { qsAll } from '@shared/utils/dom-helpers';
import { AddressType } from '@shared/enums/address.enum';
import * as s from './userProfile.module.scss';
import './userProfile.scss';
import { controls as c, newAdressControls, UserPageText, ButtonsNames, getCustomer } from './config';

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
            c.password.class('hidden pas'),
            c.passwordConfirm.class('hidden pas'),
          )}
          {this.buttonsInfo()}
        </form>
        {this.insertAddressForms()}
      </div>
    );
  }

  protected componentDidRender(): void {
    const { customer } = Store.getState();

    if (!customer) return;

    const buttons = qsAll('button', this.getContent());
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
      });
    });
    this.showUserInfoForm();
    this.showUserAddressForms();
  }

  private showUserInfoForm(): void {
    const customer = getCustomer();
    const inputs = qsAll('input,select', this.getContent());

    const customerKeys = Object.keys(customer);
    const customerValues = Object.values(customer);

    inputs.forEach((el) => {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement)) return;
      const input = el;
      input.disabled = true;

      if (customerKeys.indexOf(input.name) !== -1) {
        const index = customerKeys.indexOf(input.name);
        input.value = customerValues[index];
      }
    });
  }

  private showUserAddressForms(): void {
    const { addresses } = getCustomer();
    const forms = qsAll('[data-id]', this.getContent());
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
          {this.buttonsAddress()}
        </form>
      );
    });
    return <div>{addressArray}</div>;
  }

  private async editFormMode(e: Event): Promise<void> {
    const { target } = e;
    if (!(target instanceof HTMLButtonElement)) return;

    target.textContent = target.textContent === ButtonsNames.Save ? ButtonsNames.Edit : ButtonsNames.Save;
    const form = target.closest('form');
    if (!form) return;

    const formData = buildFormData<Customer>(form);
    console.log('formData ===>');
    console.log(formData);
    const inputs = qsAll('input, select', form);

    inputs.forEach((el) => {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement)) return;
      const input = el;
      if (target.textContent === ButtonsNames.Save) input.disabled = false;
      else input.disabled = true;
    });

    const passFields = form.querySelectorAll('.pas');
    if (!passFields) return;

    passFields.forEach((passField) => {
      if (target.textContent === ButtonsNames.Save) passField.classList.remove('hidden');
      else passField.classList.add('hidden');
    });

    form.addEventListener('change', async () => {
      if (!(await isFormValid(form))) target.disabled = true;
      else target.disabled = false;
    });
  }

  private buttonsInfo(): JSX.Element {
    return (
      <div className={s.buttonsWrapper}>
        <button onclick={this.editFormMode}>edit</button>
        <button
          onclick={(): void => {
            this.showUserInfoForm();
          }}
        >
          reset
        </button>
      </div>
    );
  }

  private buttonsAddress(): JSX.Element {
    return (
      <div className={s.buttonsWrapper}>
        <button onclick={this.editFormMode}>edit</button>
        <button disabled>reset</button>
        <button disabled>add</button>
        <button disabled>delete</button>
      </div>
    );
  }
}
export default UserProfile;

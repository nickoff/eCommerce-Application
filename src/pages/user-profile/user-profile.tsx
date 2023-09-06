/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { element, fragment } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import cx from 'clsx';
import Store from '@app/store/store';
import { render, padDot } from '@shared/utils/misc';
import NeverError from '@shared/types/never-error';
import { isFormValid, buildFormData } from '@shared/utils/form-helpers';
import { isHttpErrorType, isKeyOf } from '@shared/utils/type-guards';
import UpdateCustomerService from '@shared/api/customer/update-customer.service';
import AuthService from '@app/auth.service';
import { ICustomerCredentials } from '@shared/interfaces';
import { StorageKey, AddressType } from '@shared/enums';
import { Address } from '@commercetools/platform-sdk';
import { Route, router } from '@app/router';
import { PageTitle } from '@pages/page-title.decorator';
import { btn, btnFilled, btnOutline } from '../../styles/shared/index.module.scss';
import * as s from './user-profile.module.scss';
import { getUserInfoControls, passwordControls, getAddressControls, getNewAddressControls } from './input-controls';
import {
  IUserProfilePageProps,
  IUserProfileInfo,
  IUserPwdChangeInfo,
  IAddressChangeInfo,
  IUpdateAddressActions,
  ICreateAddressActions,
} from './user-profile.interface';
import BangIcon from './assets/bang.element.svg';
import CheckIcon from './assets/check.element.svg';

interface IRequestError {
  code: string;
  message: string;
}

function isRequestErrorArray(value: unknown): value is IRequestError[] {
  if (!Array.isArray(value)) return false;
  return value.every((v) => v && typeof v === 'object' && 'code' in v && 'message' in v);
}

@PageTitle('Profile')
class UserProfilePage extends Component<IUserProfilePageProps> {
  private editingAddress!: Address;

  private formMsgContainer: HTMLElement | null = null;

  protected componentDidRender(): void {
    this.formMsgContainer = this.getContent().querySelector(padDot(s.updateMsgContainer));
  }

  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <div className={s.card}>
          <nav className={s.pageNav}>
            <ul className={s.navList}>
              <li>
                <button
                  className={cx(['info', 'edit', 'change-pwd'].includes(this.props.visibleContent) && 'fw-bold')}
                  onclick={this.goToInfo.bind(this)}
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  className={cx(['addresses', 'edit-address'].includes(this.props.visibleContent) && 'fw-bold')}
                  onclick={this.goToAddressBook.bind(this)}
                >
                  Addresses
                </button>
              </li>
              <li>
                <button onclick={this.onLogOutClick.bind(this)}>Log out</button>
              </li>
            </ul>
          </nav>
          <div className={s.content}>
            <div className={s.updateMsgContainer}></div>
            {this.resolveContent()}
          </div>
        </div>
      </div>
    );
  }

  private onLogOutClick(): void {
    AuthService.logout();
    router.navigate(Route.Home);
  }

  private goToAddressBook(): void {
    this.setProps({ visibleContent: 'addresses' });
  }

  private resolveContent(): JSX.Element {
    const { visibleContent } = this.props;

    switch (visibleContent) {
      case 'info':
        return this.renderUserInfo();
      case 'edit':
        return this.renderEditor('info', this.updateUserInfo.bind(this));
      case 'change-pwd':
        return this.renderEditor('pwd', this.changePassword.bind(this));
      case 'addresses':
        return this.renderAddressBook();
      case 'edit-address':
        return this.renderEditor('address', this.updateAddress.bind(this));
      case 'new-address':
        return this.renderEditor('address', this.createAddress.bind(this));
      default:
        throw new NeverError(visibleContent);
    }
  }

  private async createAddress(form: HTMLFormElement): Promise<void> {
    const formData = buildFormData<IAddressChangeInfo>(form);
    const { country, city, streetName, postalCode, isBilling, isShipping, isDefaultBilling, isDefaultShipping } =
      formData;

    const address = { country, city, streetName, postalCode };

    const actions: ICreateAddressActions = {
      addBilling: Boolean(isBilling),
      addShipping: Boolean(isShipping),
      setDefaultBilling: Boolean(isDefaultBilling),
      setDefaultShipping: Boolean(isDefaultShipping),
    };

    const response = await UpdateCustomerService.createAddress(address, actions);

    if (!isHttpErrorType(response)) {
      Store.setState({ customer: response });
      const msg = 'The address has been created';
      this.formMsgContainer?.replaceChildren(this.renderUpdateInfoMessage('success', msg));
    } else {
      const msg = 'Something went wrong, try again later';
      this.formMsgContainer?.replaceChildren(this.renderUpdateInfoMessage('error', msg));
    }
  }

  private renderAddressBook(): JSX.Element {
    const { customer } = Store.getState();

    return (
      <>
        <button
          className={cx(btn, btnOutline, s.newAddressBtn)}
          onclick={(): void => this.setProps({ visibleContent: 'new-address' })}
        >
          New address
        </button>
        <div>
          {customer?.addresses.map((address) => {
            return (
              <div className={cx(s.innerCard, s.addressCard)}>
                <dl className={s.dlist}>
                  <dt>Country</dt>
                  <dd>{address.country}</dd>
                  <dt>City</dt>
                  <dd>{address.city}</dd>
                  <dt>Street</dt>
                  <dd>{address.streetName}</dd>
                  <dt>Postal code</dt>
                  <dd>{address.postalCode}</dd>
                  <dt>Type</dt>
                  <dd>
                    {this.getAddressTypes(address)
                      .reduce((acc, t) => {
                        acc.push(`${t.type} ${t.isDefault ? '(default)' : ''}`);
                        return acc;
                      }, [] as string[])
                      .join(', ')}
                  </dd>
                </dl>
                <div className={cx(s.buttonsWrapper, s.addressBtns)}>
                  <button
                    className={cx(btn, btnFilled)}
                    onclick={(): void => {
                      this.editingAddress = address;
                      this.setProps({ visibleContent: 'edit-address' });
                    }}
                  >
                    Edit
                  </button>
                  <button className={cx(btn, btnOutline)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  private getAddressTypes(address: Address): { type: AddressType; isDefault: boolean }[] {
    const { customer } = Store.getState();

    const types: { type: AddressType; isDefault: boolean }[] = [];

    const addressId = address.id as string;

    if (customer?.shippingAddressIds?.includes(addressId)) {
      types.push({ type: AddressType.Shipping, isDefault: customer.defaultShippingAddressId === addressId });
    }

    if (customer?.billingAddressIds?.includes(addressId)) {
      types.push({ type: AddressType.Billing, isDefault: customer.defaultBillingAddressId === addressId });
    }

    return types;
  }

  private renderUserInfo(): JSX.Element {
    const { customer } = Store.getState();

    return (
      <div className={s.innerCard}>
        <div className={s.userInfo}>
          <dl className={s.dlist}>
            <dt>First name</dt>
            <dd>{customer?.firstName}</dd>
            <dt>Last name</dt>
            <dd>{customer?.lastName}</dd>
            <dt>Date Of Birth</dt>
            <dd>{customer?.dateOfBirth}</dd>
            <dt>Email</dt>
            <dd>{customer?.email}</dd>
          </dl>
          <div className={s.buttonsWrapper}>
            <button className={cx(btn, btnFilled)} onclick={(): void => this.setProps({ visibleContent: 'edit' })}>
              Edit information
            </button>
            <button
              className={cx(btn, btnOutline)}
              onclick={(): void => this.setProps({ visibleContent: 'change-pwd' })}
            >
              Change password
            </button>
          </div>
        </div>
      </div>
    );
  }

  private renderEditor(
    type: 'info' | 'pwd' | 'address',
    submitHandler: (form: HTMLFormElement) => Promise<void>,
  ): JSX.Element {
    const handler = (e: Event): Promise<void> => this.onEditFormSubmit(e, submitHandler);

    return (
      <div className={s.innerCard}>
        <form className={s.editInfoForm} onsubmit={handler.bind(this)}>
          <div className={s.infoControlsContainer}>
            {type === 'address'
              ? this.renderAddressEditorContent()
              : render(type === 'info' ? getUserInfoControls() : passwordControls)}
          </div>
          <div className={s.buttonsWrapper}>
            <button type="submit" className={cx(btn, btnFilled)}>
              Save
            </button>
            <button
              type="button"
              className={cx(btn, btnOutline)}
              onclick={type === 'info' ? this.goToInfo.bind(this) : this.goToAddressBook.bind(this)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  private renderAddressEditorContent(): JSX.Element {
    const isEditingAddress = this.props.visibleContent === 'edit-address';
    const addressTypes = isEditingAddress ? this.getAddressTypes(this.editingAddress) : null;

    return (
      <div>
        {render(isEditingAddress ? getAddressControls(this.editingAddress) : getNewAddressControls())}
        <dl className={cx(s.dlist, s.addressTypesDlist)}>
          <dt>Type</dt>
          <dd>
            <label>
              <input
                name="isShipping"
                type="checkbox"
                checked={!!addressTypes && addressTypes.some((t) => t.type === AddressType.Shipping)}
              />
              {AddressType.Shipping}
            </label>
            <label>
              <input
                name="isBilling"
                type="checkbox"
                checked={!!addressTypes && addressTypes.some((t) => t.type === AddressType.Billing)}
              />
              {AddressType.Billing}
            </label>
          </dd>
          <dt>Default</dt>
          <dd>
            <label>
              <input
                name="isDefaultShipping"
                type="checkbox"
                checked={!!addressTypes && addressTypes.some((t) => t.type === AddressType.Shipping && t.isDefault)}
              />
              {AddressType.Shipping}
            </label>
            <label>
              <input
                name="isDefaultBilling"
                type="checkbox"
                checked={!!addressTypes && addressTypes.some((t) => t.type === AddressType.Billing && t.isDefault)}
              />
              {AddressType.Billing}
            </label>
          </dd>
        </dl>
      </div>
    );
  }

  private renderUpdateInfoMessage(type: 'success' | 'error', msg: string): JSX.Element {
    return (
      <div className={cx(s.updateMsg, type === 'success' ? s.updateMsgSucces : s.updateMsgError)}>
        <span>{type === 'success' ? CheckIcon.cloneNode(true) : BangIcon.cloneNode(true)}</span>
        {msg}
      </div>
    );
  }

  private async updateAddress(form: HTMLFormElement): Promise<void> {
    const { customer } = Store.getState();
    const formData = buildFormData<IAddressChangeInfo>(form);
    const { country, city, streetName, postalCode, isBilling, isShipping, isDefaultBilling, isDefaultShipping } =
      formData;

    const addressId = this.editingAddress.id as string;

    const actions: IUpdateAddressActions = {
      update: { country, city, streetName, postalCode },
      addBilling: Boolean(isBilling),
      addShipping: Boolean(isShipping),
      removeBilling: !isBilling && !!customer?.billingAddressIds?.includes(addressId),
      removeShipping: !isShipping && !!customer?.shippingAddressIds?.includes(addressId),
      setDefaultBilling: Boolean(isDefaultBilling),
      setDefaultShipping: Boolean(isDefaultShipping),
    };

    const response = await UpdateCustomerService.updateAddress(this.editingAddress.id as string, actions);

    if (!isHttpErrorType(response)) {
      Store.setState({ customer: response });
      const msg = 'The address has been updated';
      this.formMsgContainer?.replaceChildren(this.renderUpdateInfoMessage('success', msg));
    } else {
      const msg = 'Something went wrong, try again later';
      this.formMsgContainer?.replaceChildren(this.renderUpdateInfoMessage('error', msg));
    }
  }

  private async changePassword(form: HTMLFormElement): Promise<void> {
    const formData = buildFormData<IUserPwdChangeInfo>(form);
    const { currentPassword, newPassword } = formData;
    const response = await UpdateCustomerService.changePassword({ currentPassword, newPassword });

    if (!isHttpErrorType(response)) {
      const { email } = response;
      localStorage.removeItem(StorageKey.TokenCache);
      AuthService.login({ email, password: newPassword } as ICustomerCredentials);
      const msg = 'Your password has been changed';
      this.formMsgContainer?.replaceChildren(this.renderUpdateInfoMessage('success', msg));
    } else {
      const msg =
        response.body && isRequestErrorArray(response.body.errors)
          ? response.body.errors[0].message
          : 'Something went wrong, try again later';

      this.formMsgContainer?.replaceChildren(this.renderUpdateInfoMessage('error', msg));
    }
  }

  private async updateUserInfo(form: HTMLFormElement): Promise<void> {
    const formData = buildFormData<IUserProfileInfo>(form);
    const changedInfo = this.getChangedInfoFields(formData);
    const customer = await UpdateCustomerService.saveUserInfo(changedInfo);

    if (!customer) return;

    if (!isHttpErrorType(customer)) {
      Store.setState({ customer });
      const msg = 'Your profile has been updated';
      this.formMsgContainer?.replaceChildren(this.renderUpdateInfoMessage('success', msg));
    } else {
      const msg = 'Something went wrong, try again later';
      this.formMsgContainer?.replaceChildren(this.renderUpdateInfoMessage('error', msg));
    }
  }

  private async onEditFormSubmit(e: Event, callback: (form: HTMLFormElement) => Promise<void>): Promise<void> {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (this.formMsgContainer?.children.length) {
      this.formMsgContainer?.replaceChildren();
    }

    if (!(await isFormValid(form))) {
      return;
    }

    callback(form);
  }

  private getChangedInfoFields(data: IUserProfileInfo): Partial<IUserProfileInfo> {
    const { customer } = Store.getState();

    if (!customer) {
      throw new Error("Customer doesn't exist in Store");
    }

    return Object.entries(data).reduce((acc, [key, value]) => {
      if (isKeyOf(customer, key) && customer[key] !== value) {
        Object.assign(acc, { [key]: value });
      }

      return acc;
    }, {} as Partial<IUserProfileInfo>);
  }

  private goToInfo(): void {
    this.setProps({ visibleContent: 'info' });
  }
}

export default UserProfilePage;

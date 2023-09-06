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
import { btn, btnFilled, btnOutline } from '../../styles/shared/index.module.scss';
import * as s from './user-profile.module.scss';
import { getUserInfoControls, passwordControls } from './input-controls';
import { IUserProfilePageProps, IUserProfileInfo, IUserPwdChangeInfo } from './user-profile.interface';
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

class UserProfilePage extends Component<IUserProfilePageProps> {
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
                <button onclick={this.goToInfo.bind(this)}>Profile</button>
              </li>
              <li>
                <button onclick={(): void => this.setProps({ visibleContent: 'addresses' })}>Addresses</button>
              </li>
              <li>
                <button>Log out</button>
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

  private resolveContent(): JSX.Element {
    const { visibleContent } = this.props;

    switch (visibleContent) {
      case 'info':
        return this.renderUserInfo();
      case 'edit':
        return this.renderEditor('info');
      case 'change-pwd':
        return this.renderEditor('pwd');
      case 'addresses':
        return this.renderAddressBook();
      default:
        throw new NeverError(visibleContent);
    }
  }

  private renderAddressBook(): JSX.Element {
    const { customer } = Store.getState();

    return (
      <>
        <button className={cx(btn, btnOutline, s.newAddressBtn)}>New address</button>
        {customer?.addresses.map((address) => {
          return (
            <div className={s.innerCard}>
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
                <dd>{this.getAddressType(address).join(', ')}</dd>
              </dl>
              <div className={cx(s.buttonsWrapper, s.addressBtns)}>
                <button className={cx(btn, btnFilled)}>Edit</button>
                <button className={cx(btn, btnOutline)}>Delete</button>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  private getAddressType(address: Address): string[] {
    const { customer } = Store.getState();

    const types: string[] = [];

    const addressId = address.id as string;

    if (customer?.shippingAddressIds?.includes(addressId)) {
      types.push(AddressType.Shipping);
    }

    if (customer?.billingAddressIds?.includes(addressId)) {
      types.push(AddressType.Billing);
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

  private renderEditor(type: 'info' | 'pwd'): JSX.Element {
    const handler = (e: Event): Promise<void> =>
      this.onEditFormSubmit(e, type === 'info' ? this.updateUserInfo.bind(this) : this.changePassword.bind(this));

    return (
      <div className={s.innerCard}>
        <form className={s.editInfoForm} onsubmit={handler.bind(this)}>
          <div className={s.infoControlsContainer}>
            {render(type === 'info' ? getUserInfoControls() : passwordControls)}
          </div>
          <div className={s.buttonsWrapper}>
            <button type="submit" className={cx(btn, btnFilled)}>
              Save
            </button>
            <button type="button" className={cx(btn, btnOutline)} onclick={this.goToInfo.bind(this)}>
              Cancel
            </button>
          </div>
        </form>
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

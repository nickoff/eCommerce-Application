import { IUserProfileInfo, IAddressLocation, IUpdateAddressActions } from '@pages/user-profile/user-profile.interface';
import Store from '@app/store/store';
import {
  type Customer,
  type MyCustomerChangePassword,
  type MyCustomerUpdateAction,
  type MyCustomerSetFirstNameAction,
  type MyCustomerSetLastNameAction,
  type MyCustomerChangeEmailAction,
  type MyCustomerSetDateOfBirthAction,
  type MyCustomerChangeAddressAction,
  type MyCustomerAddBillingAddressIdAction,
  type MyCustomerAddShippingAddressIdAction,
  type MyCustomerRemoveBillingAddressIdAction,
  type MyCustomerRemoveShippingAddressIdAction,
  type MyCustomerSetDefaultBillingAddressAction,
  type MyCustomerSetDefaultShippingAddressAction,
} from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import extractHttpError from '../extract-http-error.decorator';

const updateActionsCreator: Record<keyof IUserProfileInfo, (field: string) => MyCustomerUpdateAction> = {
  firstName: (firstName: string): MyCustomerSetFirstNameAction => ({ action: 'setFirstName', firstName }),
  lastName: (lastName: string): MyCustomerSetLastNameAction => ({ action: 'setLastName', lastName }),
  dateOfBirth: (dateOfBirth: string): MyCustomerSetDateOfBirthAction => ({ action: 'setDateOfBirth', dateOfBirth }),
  email: (email: string): MyCustomerChangeEmailAction => ({ action: 'changeEmail', email }),
};

type AddressUpdateAction =
  | MyCustomerChangeAddressAction
  | MyCustomerAddBillingAddressIdAction
  | MyCustomerAddShippingAddressIdAction
  | MyCustomerRemoveBillingAddressIdAction
  | MyCustomerRemoveShippingAddressIdAction
  | MyCustomerSetDefaultBillingAddressAction
  | MyCustomerSetDefaultShippingAddressAction;

const updateAddressActionsCreator: Record<
  keyof IUpdateAddressActions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (addressId: string, ...args: any) => AddressUpdateAction
> = {
  update: (addressId: string, address: IAddressLocation): MyCustomerChangeAddressAction => ({
    action: 'changeAddress',
    addressId,
    address,
  }),
  addBilling: (addressId: string): MyCustomerAddBillingAddressIdAction => ({
    action: 'addBillingAddressId',
    addressId,
  }),
  addShipping: (addressId: string): MyCustomerAddShippingAddressIdAction => ({
    action: 'addShippingAddressId',
    addressId,
  }),
  removeBilling: (addressId: string): MyCustomerRemoveBillingAddressIdAction => ({
    action: 'removeBillingAddressId',
    addressId,
  }),
  removeShipping: (addressId: string): MyCustomerRemoveShippingAddressIdAction => ({
    action: 'removeShippingAddressId',
    addressId,
  }),
  setDefaultBilling: (addressId: string): MyCustomerSetDefaultBillingAddressAction => ({
    action: 'setDefaultBillingAddress',
    addressId,
  }),
  setDefaultShipping: (addressId: string): MyCustomerSetDefaultShippingAddressAction => ({
    action: 'setDefaultShippingAddress',
    addressId,
  }),
};

class UpdateCustomerService {
  @extractHttpError
  static async saveUserInfo(data: Partial<IUserProfileInfo>): Promise<Customer | HttpErrorType | null> {
    const version = this.getCustomerVersion();
    const actions = this.createInfoUpdateActions(data);

    if (!actions.length) return null;

    const updatedCustomer = (await Store.apiRoot.me().post({ body: { version, actions } }).execute()).body;

    return updatedCustomer;
  }

  private static createAddressUpdateActions(addressId: string, actions: IUpdateAddressActions): AddressUpdateAction[] {
    return Object.entries(actions).reduce<AddressUpdateAction[]>((acc, [key, value]) => {
      if (value) {
        acc.push(updateAddressActionsCreator[key as keyof IUpdateAddressActions](addressId, value));
      }

      return acc;
    }, []);
  }

  @extractHttpError
  static async updateAddress(addressId: string, rawActions: IUpdateAddressActions): Promise<Customer | HttpErrorType> {
    const version = this.getCustomerVersion();
    const actions = this.createAddressUpdateActions(addressId, rawActions);

    return (await Store.apiRoot.me().post({ body: { version, actions } }).execute()).body;
  }

  @extractHttpError
  static async changePassword(data: Omit<MyCustomerChangePassword, 'version'>): Promise<Customer | HttpErrorType> {
    const version = this.getCustomerVersion();

    return (
      await Store.apiRoot
        .me()
        .password()
        .post({ body: { version, ...data } })
        .execute()
    ).body;
  }

  private static createInfoUpdateActions(data: Partial<IUserProfileInfo>): MyCustomerUpdateAction[] {
    return Object.entries(data).reduce<MyCustomerUpdateAction[]>((acc, [key, value]) => {
      acc.push(updateActionsCreator[key as keyof IUserProfileInfo](value));
      return acc;
    }, []);
  }

  private static getCustomerVersion(): number {
    const { customer } = Store.getState();

    if (!customer) {
      throw new Error("Customer doesn't exist in Store");
    }

    return customer.version;
  }
}

export default UpdateCustomerService;

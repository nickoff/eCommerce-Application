/* eslint-disable max-lines-per-function */
import { BaseAddress, CustomerSignin, type Customer, type CustomerDraft } from '@commercetools/platform-sdk';
import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import { INewCustomer } from '@shared/interfaces';
import { AddressType } from '@shared/enums';
import { ApiRoot } from '@shared/types';
import extractHttpError from '../extract-http-error.decorator';

class CustomerRepoService {
  @extractHttpError
  static async createCustomer(apiRoot: ApiRoot, customerDraft: CustomerDraft): Promise<Customer | HttpErrorType> {
    return apiRoot
      .customers()
      .post({
        body: customerDraft,
      })
      .execute()
      .then(({ body }) => body.customer);
  }

  @extractHttpError
  static async getCustomerByCredentials(
    apiRoot: ApiRoot,
    { email, password }: CustomerSignin,
    anonymousId?: string,
    anonymousCartId?: string,
  ): Promise<Customer | HttpErrorType> {
    return apiRoot
      .login()
      .post({
        body: {
          email,
          password,
          anonymousId,
          anonymousCartId,
          anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
          updateProductData: true,
        },
      })
      .execute()
      .then(({ body }) => body.customer);
  }

  @extractHttpError
  static async getMe(apiRoot: ApiRoot): Promise<Customer | HttpErrorType> {
    return apiRoot
      .me()
      .get()
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getCustomerById(apiRoot: ApiRoot, ID: string): Promise<Customer | HttpErrorType> {
    return apiRoot
      .customers()
      .withId({ ID })
      .get()
      .execute()
      .then(({ body }) => body);
  }

  static async isEmailUnique(apiRoot: ApiRoot, email: string): Promise<boolean> {
    try {
      const response = await apiRoot
        .customers()
        .get({
          queryArgs: {
            where: `email="${email}"`,
          },
        })
        .execute();
      return !response.body.results.length;
    } catch {
      return true;
    }
  }

  static createCustomerDraft(
    customerData: INewCustomer,
    anonymousId?: string,
    anonymousCartId?: string,
  ): CustomerDraft {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      useShippingAddress,
      isDefaultBilling,
      isDefaultShipping,
    } = customerData;

    const addresses = [this.createBaseAddress(customerData, AddressType.Shipping)];

    const shippingAddresses = [0];
    const billingAddresses = [0];

    if (!useShippingAddress) {
      addresses.push(this.createBaseAddress(customerData, AddressType.Billing));
      billingAddresses[0] = 1;
    }

    const customerDraft: CustomerDraft = {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      addresses,
      shippingAddresses,
      billingAddresses,
      anonymousId,
      anonymousCartId,
    };

    if (isDefaultShipping) {
      Object.assign(customerDraft, { defaultShippingAddress: 0 });
    }

    if (isDefaultBilling && useShippingAddress) {
      Object.assign(customerDraft, { defaultBillingAddress: 0 });
    } else if (isDefaultBilling) {
      Object.assign(customerDraft, { defaultBillingAddress: 1 });
    }

    return customerDraft;
  }

  private static createBaseAddress(data: INewCustomer, addressType: AddressType): BaseAddress {
    return {
      country: data[`country${addressType}`] ?? '',
      city: data[`city${addressType}`],
      streetName: data[`street${addressType}`],
      postalCode: data[`postalCode${addressType}`],
    };
  }
}

export default CustomerRepoService;

import { BaseAddress, type Customer, type CustomerDraft } from '@commercetools/platform-sdk';
import { type HttpErrorType } from '@commercetools/sdk-client-v2';

import { INewCustomer, ICustomerCredentials } from '@shared/interfaces/customer.interface';
import { AddressType } from '@shared/enums/address.enum';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import extractHttpError from '../extract-http-error.decorator';

class CustomerRepoService {
  @extractHttpError
  static async createCustomer(
    apiRoot: ByProjectKeyRequestBuilder,
    customerDraft: CustomerDraft,
  ): Promise<Customer | HttpErrorType> {
    const response = await apiRoot
      .customers()
      .post({
        body: customerDraft,
      })
      .execute();

    const { customer } = response.body;
    return customer;
  }

  @extractHttpError
  static async getCustomerByCredentials(
    apiRoot: ByProjectKeyRequestBuilder,
    { email, password }: ICustomerCredentials,
  ): Promise<Customer | HttpErrorType> {
    const response = await apiRoot
      .me()
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();

    const { customer } = response.body;
    return customer;
  }

  @extractHttpError
  static async getMe(apiRoot: ByProjectKeyRequestBuilder): Promise<Customer | HttpErrorType> {
    const response = await apiRoot.me().get().execute();
    return response.body;
  }

  @extractHttpError
  static async getCustomerById(apiRoot: ByProjectKeyRequestBuilder, ID: string): Promise<Customer | HttpErrorType> {
    const response = await apiRoot.customers().withId({ ID }).get().execute();
    const customer = response.body;

    return customer;
  }

  static async isEmailUnique(apiRoot: ByProjectKeyRequestBuilder, email: string): Promise<boolean> {
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

  static createCustomerDraft(customerData: INewCustomer): CustomerDraft {
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

    if (!useShippingAddress) {
      addresses.push(this.createBaseAddress(customerData, AddressType.Billing));
    }

    const customerDraft: CustomerDraft = {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      addresses,
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

import { BaseAddress, type Customer, type CustomerDraft } from '@commercetools/platform-sdk';
import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import { isHttpErrorType } from '@shared/utils/type-guards';

import { INewCustomer, ICustomerCredentials } from '@shared/interfaces/customer.interface';
import apiRoot from '../api-root';
import { stringifyDate } from './stringify-date';

class CustomerRepoService {
  static async createCustomer(customerDraft: CustomerDraft): Promise<Customer | HttpErrorType> {
    try {
      const response = await apiRoot
        .customers()
        .post({
          body: customerDraft,
        })
        .execute();

      const { customer } = response.body;
      return customer;
    } catch (error) {
      if (isHttpErrorType(error)) {
        return error;
      }

      throw error;
    }
  }

  static async getCustomerByCredentials({ email, password }: ICustomerCredentials): Promise<Customer | HttpErrorType> {
    try {
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
    } catch (error) {
      if (isHttpErrorType(error)) {
        return error;
      }

      throw error;
    }
  }

  static async getCustomerById(ID: string): Promise<Customer | HttpErrorType> {
    try {
      const response = await apiRoot.customers().withId({ ID }).get().execute();
      const customer = response.body;

      return customer;
    } catch (error) {
      if (isHttpErrorType(error)) {
        return error;
      }

      throw error;
    }
  }

  static createCustomerDraft(customerData: INewCustomer): CustomerDraft {
    const { firstName, lastName, email, password, dateOfBirth, shippingAddress, billingAddress } = customerData;

    const addresses: BaseAddress[] = [shippingAddress];

    if (billingAddress) {
      addresses.push(billingAddress);
    }

    const customerDraft: CustomerDraft = {
      firstName,
      lastName,
      email,
      password,
      addresses,
      defaultShippingAddress: 0,
      defaultBillingAddress: 0,
    };

    if (dateOfBirth) {
      Object.assign(customerDraft, { dateOfBirth: stringifyDate(dateOfBirth) });
    }

    if (billingAddress) {
      Object.assign(customerDraft, { defaultBillingAddress: 1 });
    }

    return customerDraft;
  }
}

export default CustomerRepoService;

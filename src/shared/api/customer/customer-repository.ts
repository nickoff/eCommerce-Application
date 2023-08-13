import {
  type Customer,
  type CustomerDraft,
  type ClientResponse,
  type CustomerSignInResult,
} from '@commercetools/platform-sdk';

import apiRoot from '../api-root';

type CustomerCredentials = Required<Pick<CustomerDraft, 'email' | 'password'>>;

class CustomerRepository {
  static async createCustomer(customerDraft: CustomerDraft): Promise<ClientResponse<CustomerSignInResult> | Error> {
    try {
      const customer = await apiRoot
        .customers()
        .post({
          body: customerDraft,
        })
        .execute();

      return customer;
    } catch (error) {
      return error as Error;
    }
  }

  static async getCustomerByCredentials({
    email,
    password,
  }: CustomerCredentials): Promise<ClientResponse<CustomerSignInResult> | Error> {
    try {
      const customer = await apiRoot
        .me()
        .login()
        .post({
          body: {
            email,
            password,
          },
        })
        .execute();

      return customer;
    } catch (error) {
      return error as Error;
    }
  }

  static async getCustomerById(ID: string): Promise<Error | ClientResponse<Customer>> {
    try {
      const customer = await apiRoot.customers().withId({ ID }).get().execute();

      return customer;
    } catch (error) {
      return error as Error;
    }
  }
}

export default CustomerRepository;

import { type INewCustomer, type ICustomerCredentials } from '@shared/interfaces/customer.interface';
import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import CustomerRepoService from '@shared/api/customer/customer-repo.service';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { type Customer } from '@commercetools/platform-sdk';
import ApiRootCreator from '@shared/api/api-creator';
import Store from './store/store';

class AuthService {
  static async register(
    customerData: INewCustomer,
    onSuccess?: (customer: Customer) => void,
    onError?: (error: HttpErrorType) => void,
  ): Promise<Customer | HttpErrorType> {
    const { apiRoot } = Store.getState();
    const customerDraft = CustomerRepoService.createCustomerDraft(customerData);
    const result = await CustomerRepoService.createCustomer(apiRoot, customerDraft);

    if (!isHttpErrorType(result)) {
      const { email, password = '' } = customerDraft;
      await this.login({ email, password });

      if (onSuccess) {
        onSuccess(result);
      }
    } else if (onError) {
      onError(result);
    }

    return result;
  }

  static async login(
    credentials: ICustomerCredentials,
    onSuccess?: (customer: Customer) => void,
    onError?: (error: Error) => void,
  ): Promise<Customer | Error> {
    try {
      const [apiRoot] = ApiRootCreator.createPasswordFlow(credentials);
      const result = await CustomerRepoService.getCustomerByCredentials(apiRoot, credentials);

      if (!isHttpErrorType(result)) {
        Store.login(result, apiRoot);

        if (onSuccess) {
          onSuccess(result);
        }
      } else if (onError) {
        onError(result);
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (onError) {
          onError(error);
        }

        return error;
      }

      throw error;
    }
  }

  static logout(): void {
    Store.logout();
  }
}

export default AuthService;

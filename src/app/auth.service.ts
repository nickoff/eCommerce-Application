import { type INewCustomer, type ICustomerCredentials } from '@shared/interfaces/customer.interface';
import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import CustomerRepoService from '@shared/api/customer/customer-repo.service';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { type Customer } from '@commercetools/platform-sdk';
import Store from './store';

class AuthService {
  static async register(
    customerData: INewCustomer,
    onSuccess?: (customer: Customer) => void,
    onError?: (error: HttpErrorType) => void,
  ): Promise<Customer | HttpErrorType> {
    const customerDraft = CustomerRepoService.createCustomerDraft(customerData);
    const result = await CustomerRepoService.createCustomer(customerDraft);

    if (!isHttpErrorType(result)) {
      Store.getInstance().login(result);

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
    onError?: (error: HttpErrorType) => void,
  ): Promise<Customer | HttpErrorType> {
    const result = await CustomerRepoService.getCustomerByCredentials(credentials);

    if (!isHttpErrorType(result)) {
      Store.getInstance().login(result);

      if (onSuccess) {
        onSuccess(result);
      }
    } else if (onError) {
      onError(result);
    }

    return result;
  }

  static logout(): void {
    Store.getInstance().logout();
  }
}

export default AuthService;

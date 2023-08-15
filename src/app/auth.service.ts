import { type INewCustomer, type ICustomerCredentials } from '@shared/interfaces/customer.interface';
import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import CustomerRepoService from '@shared/api/customer/customer-repo.service';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { Store } from './store';

class AuthService {
  static async register(customerData: INewCustomer, onError?: (error: HttpErrorType) => void): Promise<void> {
    const customerDraft = CustomerRepoService.createCustomerDraft(customerData);
    const result = await CustomerRepoService.createCustomer(customerDraft);

    if (!isHttpErrorType(result)) {
      Store.getInstance().login(result);
    } else if (onError) {
      onError(result);
    }
  }

  static async login(credentials: ICustomerCredentials, onError?: (error: HttpErrorType) => void): Promise<void> {
    const result = await CustomerRepoService.getCustomerByCredentials(credentials);

    if (!isHttpErrorType(result)) {
      Store.getInstance().login(result);
    } else if (onError) {
      onError(result);
    }
  }

  static logout(): void {
    Store.getInstance().logout();
  }
}

export default AuthService;

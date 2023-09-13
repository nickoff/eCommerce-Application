import { type INewCustomer, type ICustomerCredentials } from '@shared/interfaces/customer.interface';
import CustomerRepoService from '@shared/api/customer/customer-repo.service';
import { isHttpErrorType, isPasswordFlowError } from '@shared/utils/type-guards';
import ApiRootCreator from '@shared/api/api-creator';
import { AuthResult } from '@shared/types';
import Store from './store/store';

class AuthService {
  static async register(customerData: INewCustomer): Promise<AuthResult> {
    const { apiRoot } = Store.getState();
    const anonymousId = Store.getState().cart?.anonymousId;
    const anonymousCartId = Store.getState().cart?.id;
    const customerDraft = CustomerRepoService.createCustomerDraft(customerData, anonymousId, anonymousCartId);
    const result = await CustomerRepoService.createCustomer(apiRoot, customerDraft);

    if (isHttpErrorType(result)) {
      return result;
    }

    const { email, password = '' } = customerDraft;
    return this.login({ email, password });
  }

  static async login(credentials: ICustomerCredentials): Promise<AuthResult> {
    try {
      const [apiRoot, ...rest] = ApiRootCreator.createPasswordFlow(credentials);
      const result = await CustomerRepoService.getCustomerByCredentials(apiRoot, credentials);

      if (!isHttpErrorType(result)) {
        Store.login(result, apiRoot, ...rest);
      }

      return result;
    } catch (error) {
      if (isPasswordFlowError(error)) {
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

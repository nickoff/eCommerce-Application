import { type Client } from '@commercetools/sdk-client-v2';
import { Cart, type Customer } from '@commercetools/platform-sdk';
import { type AuthFlow } from '@shared/enums/auth-flow.enum';
import { type ApiRoot } from '@shared/types';

export default interface IState {
  customer: Customer | null;
  apiRoot: ApiRoot;
  authFlow: AuthFlow;
  apiClient: Client;
  cart: Cart | null;
}

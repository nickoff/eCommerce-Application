import { Customer } from '@commercetools/platform-sdk';
import Component from '@shared/component';
import { isKeyOf, isHttpErrorType } from '@shared/utils/type-guards';
import { StorageKey } from '@shared/enums';
import CustomerRepoService from '@shared/api/customer/customer-repo.service';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import ApiRootCreator from '@shared/api/api-root-creator';
import { AuthFlow } from '@shared/enums/auth-flow.enum';

interface IState {
  customer: Customer | null;
  apiRoot: ByProjectKeyRequestBuilder;
  authFlow: AuthFlow;
}

export default class Store {
  private readonly state: IState;

  private observers: {
    [K in keyof IState]?: Component[];
  };

  private static instance: Store;

  static getInstance(): Store {
    if (!Store.instance) {
      const [apiRoot, authFlow] = ApiRootCreator.initFlow();
      Store.instance = new Store({ customer: null, apiRoot, authFlow });
    }

    return Store.instance;
  }

  constructor(initialState: IState) {
    this.observers = {};
    this.state = initialState;

    this.state = new Proxy<IState>(this.state, {
      set: (target, property, value): boolean => {
        Reflect.set(target, property, value);

        if (isKeyOf(this.state, property)) {
          this.notify(property);
        }

        return true;
      },
    });
  }

  async init(): Promise<void> {
    if (this.getState().authFlow !== AuthFlow.ExistingToken) {
      return;
    }

    const result = await CustomerRepoService.getMe(this.getState().apiRoot);

    if (!isHttpErrorType(result)) {
      this.setState({ customer: result });
    } else {
      localStorage.removeItem(StorageKey.TokenCache);
    }
  }

  getState(): IState {
    return this.state;
  }

  subscribe(property: keyof IState, observer: Component): void {
    const observers = this.observers[property] ?? [];
    observers.push(observer);
    this.observers[property] = observers;
  }

  login(customer: Customer, apiRootWithPassFlow: ByProjectKeyRequestBuilder): void {
    this.setState({ customer, apiRoot: apiRootWithPassFlow, authFlow: AuthFlow.Password });
  }

  logout(): void {
    const [apiRoot, authFlow] = ApiRootCreator.createCredentialsFlow();
    this.setState({ customer: null, apiRoot, authFlow });
    localStorage.removeItem(StorageKey.TokenCache);
  }

  private setState(newState: Partial<IState>): void {
    Object.assign(this.state, newState);
  }

  private notify(property: keyof IState): void {
    this.observers[property]?.forEach((observer) => observer.render());
  }
}

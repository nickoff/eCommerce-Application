/* eslint-disable no-console */
import { Customer } from '@commercetools/platform-sdk';
import { Component } from '@shared/lib';
import { isKeyOf, isHttpErrorType } from '@shared/utils/type-guards';
import { StorageKey } from '@shared/enums';
import CustomerRepoService from '@shared/api/customer/customer-repo.service';
import { ApiRoot } from '@shared/types';
import ApiCreator from '@shared/api/api-creator';
import { AuthFlow } from '@shared/enums/auth-flow.enum';
import { Client } from '@commercetools/sdk-client-v2';
import CartRepoService from '@shared/api/cart/cart-repo.service';
import IState from './state.interface';

class Store {
  private readonly state: IState;

  private observers: {
    [K in keyof IState]?: Component[];
  };

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

  get apiRoot(): ApiRoot {
    return this.getState().apiRoot;
  }

  async init(): Promise<void> {
    if (localStorage.getItem(StorageKey.TokenCachePass)) {
      const result = await CustomerRepoService.getMe(this.getState().apiRoot);

      if (!isHttpErrorType(result)) {
        this.setState({ customer: result });
      } else {
        localStorage.removeItem(StorageKey.TokenCachePass);
      }
    }

    if (this.getState().authFlow === AuthFlow.Anonymous) {
      const newCart = await CartRepoService.createMeCart(this.getState().apiRoot, { currency: 'USD', country: 'BY' });

      if (!isHttpErrorType(newCart)) {
        this.setState({ cart: newCart });
      }
    }

    const activeCart = await CartRepoService.getMyActiveCart(this.getState().apiRoot);

    if (!isHttpErrorType(activeCart)) {
      this.setState({ cart: activeCart });
    } else {
      localStorage.removeItem(StorageKey.TokenCacheAnonym);
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

  async login(customer: Customer, apiRoot: ApiRoot, authFlow: AuthFlow, apiClient: Client): Promise<void> {
    this.setState({ customer, apiRoot, authFlow, apiClient });

    const activeCart = await CartRepoService.getMyActiveCart(this.getState().apiRoot);

    if (!isHttpErrorType(activeCart)) {
      this.setState({ cart: activeCart });
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem(StorageKey.TokenCachePass);
    localStorage.removeItem(StorageKey.TokenCacheAnonym);
    const [apiRoot, authFlow, apiClient] = ApiCreator.createAnonymousFlow();
    this.setState({ customer: null, apiRoot, authFlow, apiClient });

    if (this.getState().authFlow === AuthFlow.Anonymous) {
      const newCart = await CartRepoService.createMeCart(this.getState().apiRoot, { currency: 'USD', country: 'BY' });

      if (!isHttpErrorType(newCart)) {
        this.setState({ cart: newCart });
      }
    }

    const activeCart = await CartRepoService.getMyActiveCart(this.getState().apiRoot);

    if (!isHttpErrorType(activeCart)) {
      this.setState({ cart: activeCart });
    }
  }

  setState(newState: Partial<IState>): void {
    Object.assign(this.state, newState);
  }

  private notify(property: keyof IState): void {
    this.observers[property]?.forEach((observer) => observer.render());
  }
}

const [apiRoot, authFlow, apiClient] = ApiCreator.initFlow();

export default new Store({ customer: null, cart: null, apiRoot, authFlow, apiClient });

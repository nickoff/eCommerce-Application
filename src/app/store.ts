import { Customer } from '@commercetools/platform-sdk';
import Component from '@shared/component';
import { isKeyOf, isHttpErrorType } from '@shared/utils/type-guards';
import { StorageKey } from '@shared/enums';
import CustomerRepoService from '@shared/api/customer/customer-repo.service';

interface IState {
  customer: Customer | null;
}

export class Store {
  private state: IState;

  private observers: {
    [K in keyof IState]?: Component[];
  };

  private static instance: Store;

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store({ customer: null });
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
    const savedCustomerID = localStorage.getItem(StorageKey.CustomerID);

    if (!savedCustomerID) {
      return;
    }

    const result = await CustomerRepoService.getCustomerById(savedCustomerID);

    if (!isHttpErrorType(result)) {
      this.setState({ customer: result });
    } else {
      localStorage.removeItem(StorageKey.CustomerID);
    }
  }

  subscribe(property: keyof IState, observer: Component): void {
    const observers = this.observers[property] ?? [];
    observers.push(observer);
    this.observers[property] = observers;
  }

  login(customer: Customer): void {
    this.setState({ customer });
    localStorage.setItem(StorageKey.CustomerID, customer.id);
  }

  logout(): void {
    this.setState({ customer: null });
    localStorage.removeItem(StorageKey.CustomerID);
  }

  private setState(newState: Partial<IState>): void {
    Object.assign(this.state, newState);
  }

  private notify(property: keyof IState): void {
    this.observers[property]?.forEach((observer) => observer.render());
  }
}

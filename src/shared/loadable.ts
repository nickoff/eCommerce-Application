type KeyBooleanValue = {
  [key: string]: boolean;
};

export interface ILoadable<T> {
  loading: T;
  setLoading(key: keyof T, value: boolean): void;
}

type LoadableObservers<T extends KeyBooleanValue> = {
  [K in keyof T]?: ((k: T[K]) => void)[];
};

export abstract class Loadable<T extends KeyBooleanValue> implements ILoadable<T> {
  private observers = {} as LoadableObservers<T>;

  loading: T;

  constructor() {
    this.loading = {} as T;

    // this.setLoading = new Proxy(this.setLoading, {
    //   apply: (target, thisArg, args) => {},
    // });
  }

  setLoading(key: keyof T, value: boolean): void {
    this.loading[key] = value as T[typeof key];
  }

  onLoading<K extends keyof T>(key: K, callback: (isLoading: T[K]) => void): void {
    const listeners = this.observers[key] ?? [];
    listeners.push(callback);
  }
}

// export const loadable = <T>(keyLoading: keyof T) =>
//   createDecorator<ILoadable<T>>(async (self, method, ...args) => {
//     try {
//       if (self.loading[keyLoading]) return;
//       self.setLoading(keyLoading, true);
//       return await method.call(self, ...args);
//     } finally {
//       self.setLoading(keyLoading, false);
//     }
//   });

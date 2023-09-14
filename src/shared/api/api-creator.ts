import { ClientBuilder, type TokenStore, type Client, type TokenCache } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ApiRoot } from '@shared/types';
import { ICustomerCredentials } from '@shared/interfaces';
import { StorageKey, AuthFlow } from '@shared/enums';
import { PROJECT_KEY } from './constants';
import {
  httpMiddlewareOptions,
  authMiddlewareOptions,
  getPassAuthMiddlewareOptions,
  getAnonymousAuthMiddlewareOptions,
} from './middlewares.config';
import CartRepoService from './cart/cart-repo.service';

const initialToken: TokenStore = {
  token: '',
  expirationTime: 0,
};

type ApiCreatorReturn = [ApiRoot, AuthFlow, Client];

export default class ApiCreator {
  static initFlow(): ApiCreatorReturn {
    return this.isTokenCached() ? this.createExistingTokenFlow() : this.createAnonymousFlow();
  }

  static createCredentialsFlow(): ApiCreatorReturn {
    const client = new ClientBuilder()
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    return [this.createApiRoot(client), AuthFlow.Credentials, client];
  }

  static createAnonymousFlow(): ApiCreatorReturn {
    const options = getAnonymousAuthMiddlewareOptions(this.tokenCacheAnonym);

    const client = new ClientBuilder()
      .withAnonymousSessionFlow(options)
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    CartRepoService.createMeCart(this.createApiRoot(client), { currency: 'USD', country: 'BY' });

    return [this.createApiRoot(client), AuthFlow.Anonymous, client];
  }

  static createPasswordFlow({ email: username, password }: ICustomerCredentials): ApiCreatorReturn {
    const options = getPassAuthMiddlewareOptions({ username, password }, this.tokenCachePass);

    const client = new ClientBuilder().withPasswordFlow(options).withHttpMiddleware(httpMiddlewareOptions).build();
    return [this.createApiRoot(client), AuthFlow.Password, client];
  }

  static createExistingTokenFlow(): ApiCreatorReturn {
    const token = this.tokenCachePass.get().token || this.tokenCacheAnonym.get().token;

    if (!token) {
      throw new Error('Cannot find cached token');
    }

    const authorization = `Bearer ${token}`;

    const client = new ClientBuilder()
      .withExistingTokenFlow(authorization, { force: true })
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    return [this.createApiRoot(client), AuthFlow.ExistingToken, client];
  }

  private static isTokenCached(): boolean {
    return !!this.tokenCachePass.get().token || !!this.tokenCacheAnonym.get().token;
  }

  private static tokenCachePass: TokenCache = {
    get: (): TokenStore => {
      const cache = localStorage.getItem(StorageKey.TokenCachePass);
      return cache ? JSON.parse(cache) : initialToken;
    },
    set: (cache: TokenStore): void => {
      localStorage.setItem(StorageKey.TokenCachePass, JSON.stringify(cache));
    },
  };

  private static tokenCacheAnonym: TokenCache = {
    get: (): TokenStore => {
      const cache = localStorage.getItem(StorageKey.TokenCacheAnonym);
      return cache ? JSON.parse(cache) : initialToken;
    },
    set: (cache: TokenStore): void => {
      localStorage.setItem(StorageKey.TokenCacheAnonym, JSON.stringify(cache));
    },
  };

  private static createApiRoot(client: Client): ApiRoot {
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });
  }
}

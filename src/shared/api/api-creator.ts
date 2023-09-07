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
    const options = getAnonymousAuthMiddlewareOptions(this.tokenCache);

    const client = new ClientBuilder()
      .withAnonymousSessionFlow(options)
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    return [this.createApiRoot(client), AuthFlow.Anonymous, client];
  }

  static createPasswordFlow({ email: username, password }: ICustomerCredentials): ApiCreatorReturn {
    const options = getPassAuthMiddlewareOptions({ username, password }, this.tokenCache);

    const client = new ClientBuilder().withPasswordFlow(options).withHttpMiddleware(httpMiddlewareOptions).build();
    return [this.createApiRoot(client), AuthFlow.Password, client];
  }

  static createExistingTokenFlow(): ApiCreatorReturn {
    const { token } = this.tokenCache.get();

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
    return !!this.tokenCache.get().token;
  }

  private static tokenCache: TokenCache = {
    get: (): TokenStore => {
      const cache = localStorage.getItem(StorageKey.TokenCache);
      return cache ? JSON.parse(cache) : initialToken;
    },
    set: (cache: TokenStore): void => {
      localStorage.setItem(StorageKey.TokenCache, JSON.stringify(cache));
    },
  };

  private static createApiRoot(client: Client): ApiRoot {
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });
  }
}

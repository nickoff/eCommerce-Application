import { ClientBuilder, type TokenStore, type Client, type TokenCache } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ICustomerCredentials } from '@shared/interfaces/customer.interface';
import { StorageKey } from '@shared/enums';
import { AuthFlow } from '@shared/enums/auth-flow.enum';
import { PROJECT_KEY } from './constants';
import { httpMiddlewareOptions, authMiddlewareOptions, getPassAuthMiddlewareOptions } from './middlewares.config';

const initialToken: TokenStore = {
  token: '',
  expirationTime: 0,
};

export default class ApiRootCreator {
  static initFlow(): [ByProjectKeyRequestBuilder, AuthFlow] {
    return this.isTokenCached() ? this.createExistingTokenFlow() : this.createCredentialsFlow();
  }

  static createCredentialsFlow(): [ByProjectKeyRequestBuilder, AuthFlow.Credentials] {
    const client = new ClientBuilder()
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    return [this.createApiRoot(client), AuthFlow.Credentials];
  }

  static createPasswordFlow({
    email: username,
    password,
  }: ICustomerCredentials): [ByProjectKeyRequestBuilder, AuthFlow.Password] {
    const options = getPassAuthMiddlewareOptions({ username, password }, this.tokenCache);

    const client = new ClientBuilder().withPasswordFlow(options).withHttpMiddleware(httpMiddlewareOptions).build();
    return [this.createApiRoot(client), AuthFlow.Password];
  }

  static createExistingTokenFlow(): [ByProjectKeyRequestBuilder, AuthFlow.ExistingToken] {
    const { token } = this.tokenCache.get();

    if (!token) {
      throw new Error('Cannot find cached token');
    }

    const authorization = `Bearer ${token}`;

    const client = new ClientBuilder()
      .withExistingTokenFlow(authorization, { force: true })
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    return [this.createApiRoot(client), AuthFlow.ExistingToken];
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

  private static createApiRoot(client: Client): ByProjectKeyRequestBuilder {
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });
  }
}

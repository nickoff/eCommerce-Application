import { ClientBuilder, type AuthMiddlewareOptions, type HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { CTP_PROJECT_KEY, CTP_API_URL, CTP_CLIENT_ID, CTP_CLIENT_SECRET, CTP_AUTH_URL, CTP_SCOPES } from './constants';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: CTP_AUTH_URL,
  projectKey: CTP_PROJECT_KEY,
  credentials: {
    clientId: CTP_CLIENT_ID,
    clientSecret: CTP_CLIENT_SECRET,
  },
  scopes: CTP_SCOPES,
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: CTP_API_URL,
  fetch,
};

export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

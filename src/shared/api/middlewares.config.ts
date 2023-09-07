import {
  type AuthMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
  type UserAuthOptions,
  type HttpMiddlewareOptions,
  type TokenCache,
  AnonymousAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import * as CTP from './constants';

export const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: CTP.API_URL,
  fetch,
};

export const baseCredentials = {
  clientId: CTP.CLIENT_ID,
  clientSecret: CTP.CLIENT_SECRET,
};

export const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: CTP.AUTH_URL,
  projectKey: CTP.PROJECT_KEY,
  credentials: baseCredentials,
  scopes: CTP.SCOPES,
  fetch,
};

export function getPassAuthMiddlewareOptions(
  { username, password }: UserAuthOptions,
  tokenCache?: TokenCache,
): PasswordAuthMiddlewareOptions {
  return {
    ...authMiddlewareOptions,
    credentials: {
      ...baseCredentials,
      user: {
        username,
        password,
      },
    },
    tokenCache,
  };
}

export function getAnonymousAuthMiddlewareOptions(tokenCache?: TokenCache): AnonymousAuthMiddlewareOptions {
  return {
    ...authMiddlewareOptions,
    credentials: { ...baseCredentials },
    tokenCache,
  };
}

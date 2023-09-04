import { Route } from '@app/router';

enum LinkText {
  AccountSettings = 'ACCOUNT SETTINGS',
  Addresses = 'ADDRESSES',
}

export const userProfileLinks = [
  { text: LinkText.AccountSettings, route: Route.UserAccount },
  { text: LinkText.Addresses, route: Route.UserAddresses },
];

import { Route } from '@app/router';

export enum BasketPageText {
  Title = 'Cart',
  BntRemoveAll = 'Remove all',
  EmptyCart = 'Your cart is empty. Let’s change that.',
  Total = 'Total:',
}

enum LinkText {
  Headphones = 'HEADPHONES',
  Speakers = 'SPEAKERS',
  Earphones = 'EARPHONES',
}

export const linksConfig = [
  { text: LinkText.Headphones, route: Route.Headphones },
  { text: LinkText.Speakers, route: Route.Speakers },
  { text: LinkText.Earphones, route: Route.Earphones },
];

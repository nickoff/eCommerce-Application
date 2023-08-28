import { Route } from '@app/router';

enum LinkText {
  Home = 'HOME',
  Headphones = 'HEADPHONES',
  Speakers = 'SPEAKERS',
  Earphones = 'EARPHONES',
}

export const linksConfig = [
  { text: LinkText.Home, route: Route.Home },
  { text: LinkText.Headphones, route: Route.Headphones },
  { text: LinkText.Speakers, route: '#' },
  { text: LinkText.Earphones, route: Route.Earphones },
];

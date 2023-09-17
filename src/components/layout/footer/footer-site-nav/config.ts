import { Route } from '@app/router';

enum LinkText {
  Home = 'HOME',
  AboutUs = 'ABOUT US',
  Headphones = 'HEADPHONES',
  Speakers = 'SPEAKERS',
  Earphones = 'EARPHONES',
  Basket = 'BASKET',
}

export const linksConfig = [
  { text: LinkText.Home, route: Route.Home },
  { text: LinkText.AboutUs, route: Route.AboutUs },
  { text: LinkText.Headphones, route: Route.Headphones },
  { text: LinkText.Speakers, route: Route.Speakers },
  { text: LinkText.Earphones, route: Route.Earphones },
  { text: LinkText.Basket, route: Route.Basket },
];

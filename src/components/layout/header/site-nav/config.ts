enum LinkText {
  Home = 'HOME',
  Headphones = 'HEADPHONES',
  Speakers = 'SPEAKERS',
  Earphones = 'EARPHONES',
}

export const linksConfig = [
  { text: LinkText.Home, route: 'home' },
  { text: LinkText.Headphones, route: '#' },
  { text: LinkText.Speakers, route: '#' },
  { text: LinkText.Earphones, route: '#' },
];

import Header from '@components/layout/header/header';
import Main from '@components/layout/main/main';
import { initRouter } from '@app/router/routing';
import Store from './store';

export default class App {
  constructor() {
    document.body.append(new Header().render(), Main.render());
    initRouter();
    Store.getInstance().init();
  }
}

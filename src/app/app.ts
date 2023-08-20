import { initRouter } from '@app/router/routing';
import Layout from '@components/layout/layout';
import Store from './store';

export default class App {
  constructor() {
    document.body.append(Layout());
    initRouter();
    Store.getInstance().init();
  }
}

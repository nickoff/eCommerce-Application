import { initRouter } from '@app/router/routing';
import Layout from '@components/layout/layout';
import Store from './store/store';

export default class App {
  static async init(): Promise<void> {
    await Store.init();
    document.body.append(Layout());
    initRouter();
  }
}

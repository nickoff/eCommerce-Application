import Main from '@components/layout/main/main';
import Navigo from 'navigo';
import PageLogin from '@pages/login/login';
import PageReg from '@pages/registration/registration';
import PageHome from '@pages/home/home';
import Page404 from '@pages/page404/page404';
import Store from '@app/store/store';
import CatalogPage from '@pages/catalog/catalog';
import { Route } from './routes';

const router = new Navigo('/');

const beforeHook = (done: (p?: boolean) => void): void => {
  if (Store.getState().customer) {
    done(false);
    router.navigate(Route.Home);
  } else {
    done();
  }
};

const initRouter = (): void => {
  router
    .on(() => Main.setProps({ page: new PageHome() }))
    .on({
      [Route.Home]: () => Main.setProps({ page: new PageHome() }),
      [Route.Login]: {
        as: 'login-page',
        uses: () => Main.setProps({ page: new PageLogin() }),
        hooks: {
          before: beforeHook,
        },
      },
      [Route.Registration]: {
        as: 'reg-page',
        uses: () => Main.setProps({ page: new PageReg() }),
        hooks: {
          before: beforeHook,
        },
      },
      [Route.Headphones]: {
        as: 'headphones-catalog',
        uses: () => Main.setProps({ page: new CatalogPage() }),
      },
    })
    .notFound(() => Main.setProps({ page: new Page404() }))
    .resolve();
};

export { initRouter, router };

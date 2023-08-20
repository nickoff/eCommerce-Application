import Main from '@components/layout/main/main';
import Navigo from 'navigo';
import PageLogin from '@pages/login/login';
import PageReg from '@pages/registration/registration';
import PageHome from '@pages/home/home';
import Page404 from '@pages/page404/page404';
import { Route } from './routes';

const router = new Navigo('/');

const initRouter = (): void => {
  router
    .on({
      [Route.Home]: () => Main.setProps({ page: new PageHome() }),
      [Route.Default]: () => Main.setProps({ page: new PageHome() }),
      [Route.Login]: () => Main.setProps({ page: new PageLogin() }),
      [Route.Registration]: () => Main.setProps({ page: new PageReg() }),
    })
    .resolve();

  router.notFound(() => {
    Main.setProps({ page: new Page404() });
  });
};
export { initRouter, router };

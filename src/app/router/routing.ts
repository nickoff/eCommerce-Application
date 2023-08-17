import Main from '@components/layout/main/main';
import Navigo from 'navigo';
import PageLogin from '@pages/login/login';
import PageReg from '@pages/registration/registration';
import PageHome from '@pages/home/home';
import Page404 from '@pages/page404/page404';
import Routes from './routes';

const router = new Navigo('/');

const initRouter = (): void => {
  router
    .on({
      [Routes.Home]: () => Main.setProps({ page: new PageHome() }),
      [Routes.Default]: () => Main.setProps({ page: new PageHome() }),
      [Routes.Login]: () => Main.setProps({ page: new PageLogin() }),
      [Routes.Registration]: () => Main.setProps({ page: new PageReg() }),
    })
    .resolve();

  router.notFound(() => {
    Main.setProps({ page: new Page404() });
  });
};
export { initRouter, router };

import Main from '@components/layout/main/main';
import Navigo from 'navigo';
import PageLogin from '@pages/login/login';
import PageReg from '@pages/registration/registration';
import PageHome from '@pages/home/home';

const routing = (): void => {
  const router = new Navigo('/');

  router
    .on({
      '/home': () => Main.setProps({ page: new PageHome() }),
      '/login': () => Main.setProps({ page: new PageLogin() }),
      '/registration': () => Main.setProps({ page: new PageReg() }),
    })
    .resolve();
};
export default routing;

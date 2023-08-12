import { MouseEvtName } from '@shared/constants/events';

const showLoginPage = (): void => {
  const btnSignIn: HTMLElement = <HTMLElement>document.querySelector('.user-menu__dropdown-item');

  const loginPage: HTMLElement = <HTMLElement>document.querySelector('.page-login-wrapper');

  btnSignIn.addEventListener(MouseEvtName.CLICK, () => {
    loginPage.classList.toggle('hidden');
  });
};

export default showLoginPage;

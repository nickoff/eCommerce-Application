import { MouseEvtName } from '@shared/constants/events';

const showAuthorizationPage = (): void => {
  const loginPage: HTMLElement = <HTMLElement>document.querySelector('.page-login');
  const regPage: HTMLElement = <HTMLElement>document.querySelector('.page-reg');

  document.addEventListener(MouseEvtName.CLICK, (e) => {
    const { target } = e;
    if (target instanceof HTMLElement) {
      if (target.textContent?.toLocaleLowerCase() === 'sign in') {
        loginPage.classList.remove('hidden');
        regPage.classList.add('hidden');
      }
      if (target.textContent?.toLocaleLowerCase() === 'sign up') {
        regPage.classList.remove('hidden');
        loginPage.classList.add('hidden');
      }
    }
  });
};

export default showAuthorizationPage;

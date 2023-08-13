import { MouseEvtName } from '@shared/constants/events';

const showLoginOrRegPage = (): void => {
  const loginPage: HTMLElement = <HTMLElement>document.querySelector('.page-login');

  document.addEventListener(MouseEvtName.CLICK, (e) => {
    const { target } = e;
    if (target instanceof HTMLElement) {
      if (target.textContent === 'Sign In') {
        loginPage.classList.toggle('hidden');
      }
    }
  });
};

export default showLoginOrRegPage;

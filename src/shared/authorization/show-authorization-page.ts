import { MouseEvtName } from '@shared/constants/events';

const showAuthorizationPage = (): void => {
  const loginForm: HTMLElement = <HTMLElement>document.querySelector('.form-login');
  const regForm: HTMLElement = <HTMLElement>document.querySelector('.form-reg');

  document.addEventListener(MouseEvtName.CLICK, (e) => {
    const { target } = e;
    if (target instanceof HTMLElement) {
      if (target.textContent?.toLocaleLowerCase() === 'sign in') {
        loginForm.classList.toggle('hidden');
        regForm.classList.add('hidden');
      }
      if (target.textContent?.toLocaleLowerCase() === 'sign up') {
        regForm.classList.toggle('hidden');
        loginForm.classList.add('hidden');
      }
    }
  });
};

export default showAuthorizationPage;

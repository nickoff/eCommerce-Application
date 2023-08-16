import Main from '@components/layout/main/main';
import PageReg from '@pages/registration/registration';
import PageLogin from '@pages/login/login';

export const anonymConfig = [
  { onclick: (): void => Main.setProps({ page: new PageLogin() }), text: 'Sign In' },
  { onclick: (): void => Main.setProps({ page: new PageReg() }), text: 'Sign Up' },
];

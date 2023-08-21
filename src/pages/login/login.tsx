import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { isFormValid, buildFormData } from '@shared/utils/form-helpers';
import cx from 'clsx';
import { qs } from '@shared/utils/dom-helpers';
import { ICustomerCredentials } from '@shared/interfaces/customer.interface';
import AuthService from '@app/auth.service';
import { Route } from '@app/router';
import { router } from '@app/router/routing';
import * as s from './login.module.scss';
import { btn, btnFilled } from '../../styles/shared/index.module.scss';
import { controls, LoginPageText } from './config';

class PageLogin extends Component {
  private form!: HTMLFormElement;

  private msgPara!: HTMLParagraphElement;

  componentDidRender(): void {
    this.form = qs('form', this.getContent());
    this.msgPara = qs(`.${s.loginMsg}`, this.getContent());
  }

  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h2 className={s.pageTitle}>{LoginPageText.Title}</h2>
        <form className={s.form}>
          {controls.email.render()}
          {controls.password.render()}
          <span className={s.signText}>
            Not registered yet?
            <a className={s.signLink} href={Route.Registration} dataset={{ navigo: '' }}>
              {LoginPageText.Link}
            </a>
          </span>
          <p className={s.loginMsg}></p>
          <button className={cx(btn, btnFilled, s.submitBtn)} onclick={this.onFormSubmit.bind(this)}>
            SIGN IN
          </button>
        </form>
      </div>
    );
  }

  private async onFormSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (!(await isFormValid(this.form))) {
      return;
    }

    const credentials = buildFormData<ICustomerCredentials>(this.form);

    const onSucces = (): void => {
      this.msgPara.innerHTML = "You've logged in";
      setTimeout(() => router.navigate(Route.Home), 500);
    };

    const onError = (): void => {
      this.msgPara.innerHTML = 'Wrong email or password';
    };

    await AuthService.login(
      credentials,
      () => onSucces(),
      () => onError(),
    );
  }
}

export default PageLogin;

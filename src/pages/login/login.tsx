import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { isFormValid, buildFormData } from '@shared/utils/form-helpers';
import { qs } from '@shared/utils/dom-helpers';
import { ICustomerCredentials } from '@shared/interfaces/customer.interface';
import AuthService from '@app/auth.service';
import { Route, router } from '@app/router';
import { PageTitle } from '@pages/page-title.decorator';
import Loader from 'promise-loading-spinner';
import { Component, Child } from '@shared/lib';
import { AuthResult } from '@shared/types';
import * as s from './login.module.scss';
import { btn, btnFilled } from '../../styles/shared/index.module.scss';
import { controls, LoginPageText } from './config';
import Store from '../../app/store/store';

@PageTitle('Login')
class PageLogin extends Component {
  @Child(s.form) private form!: HTMLFormElement;

  @Child(s.errorMsg) private msgPara!: HTMLParagraphElement;

  protected componentDidRender(): void {
    const spinnerEl = qs('[data-spinner]', this.getContent());

    const loader = new Loader({ loaderElement: spinnerEl, classActive: 'spinner-border' });
    this.login = loader.wrapFunction(this.login.bind(this));
  }

  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h2 className={s.pageTitle}>{LoginPageText.Title}</h2>
        <form className={s.form} onsubmit={this.onFormSubmit.bind(this)} noValidate>
          {controls.email.render()}
          {controls.password.render()}
          <span className={s.signText}>
            Not registered yet?
            <a className={s.signLink} href={Route.Registration} dataset={{ navigo: '' }}>
              {LoginPageText.Link}
            </a>
          </span>
          <div className={s.msgWrapper}>
            <p className={s.errorMsg}></p>
            <div attributes={{ role: 'status', 'data-spinner': '' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <button className={cx(btn, btnFilled, s.submitBtn)} type="submit">
            SIGN IN
          </button>
        </form>
      </div>
    );
  }

  private async onFormSubmit(e: Event): Promise<void> {
    e.preventDefault();
    this.msgPara.textContent = '';
    this.login();
  }

  private async login(): Promise<void> {
    if (!(await isFormValid(this.form))) {
      return;
    }

    const credentials = buildFormData<ICustomerCredentials>(this.form);
    const anonymousId = Store.getState().cart?.anonymousId;
    const anonymousCartId = Store.getState().cart?.id;
    const result = await AuthService.login(credentials, anonymousId, anonymousCartId);
    this.handleLoginResult(result);
  }

  private async handleLoginResult(result: AuthResult): Promise<void> {
    if (result instanceof Error) {
      setTimeout(() => {
        this.msgPara.textContent = 'Wrong email or password';
      }, 100);
    } else {
      router.navigate(Route.Home);
    }
  }
}

export default PageLogin;

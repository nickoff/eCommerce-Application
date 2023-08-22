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
import * as s from './login.module.scss';
import { btn, btnFilled } from '../../styles/shared/index.module.scss';
import { controls, LoginPageText } from './config';

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
        <form className={s.form}>
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
          <button className={cx(btn, btnFilled, s.submitBtn)} onclick={this.onFormSubmit.bind(this)}>
            SIGN IN
          </button>
        </form>
      </div>
    );
  }

  private async onFormSubmit(e: Event): Promise<void> {
    e.preventDefault();
    this.msgPara.textContent = '';

    if (!(await isFormValid(this.form))) {
      return;
    }

    const credentials = buildFormData<ICustomerCredentials>(this.form);
    this.login(credentials);
  }

  private async login(credentials: ICustomerCredentials): Promise<void> {
    const onSucces = (): void => {
      router.navigate(Route.Home);
    };

    const onError = (): void => {
      setTimeout(() => {
        this.msgPara.textContent = 'Wrong email or password';
      }, 100);
    };

    await AuthService.login(
      credentials,
      () => onSucces(),
      () => onError(),
    );
  }
}

export default PageLogin;

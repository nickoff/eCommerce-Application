import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { InputName } from '@shared/enums/input.enum';
import { isFormValid, buildFormData } from '@shared/utils/form-helpers';
import Button from '@components/shared/ui/button/button';
import { qs } from '@shared/utils/dom-helpers';
import { ICustomerCredentials } from '@shared/interfaces/customer.interface';
import AuthService from '@app/auth.service';
import Route from '@app/router/routes';
import { Input } from '@components/shared/ui/input/input';
import s from './login.module.scss';

import LoginPageText from './config';

const emailInput = new Input({
  name: InputName.Email,
  label: LoginPageText.LableForEmail,
  required: true,
});

const pasInput = new Input({
  name: InputName.Password,
  label: LoginPageText.LableForPas,
  required: true,
});

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
          {emailInput.render()}
          {pasInput.render()}
          <span className={s.signText}>
            Not registered yet?
            <a className={s.signLink} href={Route.Registration} attributes={{ 'data-navigo': '' }}>
              {LoginPageText.Link}
            </a>
          </span>
          <p className={s.loginMsg}></p>
          <Button onClick={this.onFormSubmit.bind(this)} content={'Sign In'} />
        </form>
      </div>
    );
  }

  private async onFormSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (!isFormValid(this.form)) {
      return;
    }

    const credentials = buildFormData<ICustomerCredentials>(this.form);

    const onSucces = (): void => {
      this.msgPara.innerHTML = "You've logged in";
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

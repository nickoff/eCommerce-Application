/* eslint-disable max-lines-per-function */
import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Child, Component } from '@shared/lib';
import { render } from '@shared/utils/misc';
import { AuthResult, type FormControlType } from '@shared/types';
import { Route, router } from '@app/router';
import { isFormValid, buildFormData } from '@shared/utils/form-helpers';
import { INewCustomer } from '@shared/interfaces/customer.interface';
import AuthService from '@app/auth.service';
import { AddressType } from '@shared/enums/address.enum';
import { PageTitle } from '@pages/page-title.decorator';
import Loader from 'promise-loading-spinner';
import { btn, btnFilled } from '../../styles/shared/index.module.scss';
import * as s from './registration.module.scss';
import { controls as c, newAdressControls } from './config';

@PageTitle('Sign Up')
class PageReg extends Component {
  private billingControls: FormControlType[];

  private addressToggler: HTMLInputElement;

  @Child(s.form) private form!: HTMLFormElement;

  @Child(s.para) private msgPara!: HTMLParagraphElement;

  @Child('[data-spinner]', true) private spinner!: HTMLElement;

  constructor() {
    super();
    this.billingControls = newAdressControls(AddressType.Billing);

    this.addressToggler = document.createElement('input');
    this.addressToggler.type = 'checkbox';
    this.addressToggler.name = 'useShippingAddress';
  }

  protected componentDidRender(): void {
    this.addressToggler.addEventListener('change', () => this.toggleControls(this.billingControls));

    const loader = new Loader({ loaderElement: this.spinner, classActive: 'spinner-border' });
    this.register = loader.wrapFunction(this.register.bind(this));
  }

  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h2 className={s.heading}>Please sign up to continue</h2>
        <form className={s.form} onsubmit={this.onFormSubmit.bind(this)} noValidate>
          <div className={s.formGrid}>
            {render(
              c.firstName.class(s.firstName),
              c.lastName.class(s.lastName),
              c.email.class(s.email),
              c.password.class(s.pwd),
              c.passwordConfirm.class(s.pwdСonfirm),
              c.dateOfBirth.class(s.birth),
              c.phone.class(s.phone),
            )}
            <div className={s.shipping}>
              <h3 className={s.addressHeading}>Shipping Address</h3>
              <label className={s.defaultLabel}>
                Use as default
                <input type="checkbox" name="isDefaultShipping" />
              </label>
              {render(newAdressControls(AddressType.Shipping))}
            </div>
            <div className={s.billing}>
              <h3 className={s.addressHeading}>Billing Address</h3>
              <label className={s.billingLabel}>Use shipping address {this.addressToggler}</label>
              <label className={s.defaultLabel}>
                Use as default
                <input type="checkbox" name="isDefaultBilling" />
              </label>
              {render(this.billingControls)}
            </div>
          </div>
          <p className={s.para}>
            Already registered?
            <a className={s.signLink} href={Route.Login} dataset={{ navigo: '' }}>
              Sign In
            </a>
          </p>
          <div className={s.msgWrapper}>
            <p className={s.errorMsg}></p>
            <div attributes={{ role: 'status', 'data-spinner': '' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <button className={cx(btn, btnFilled, s.submitBtn)} type="submit">
            SIGN UP
          </button>
        </form>
      </div>
    );
  }

  private toggleControls(inputs: FormControlType[]): void {
    inputs.forEach((i) => {
      i.clear();
      i.setProps({ disabled: !i.getState().disabled });
    });
  }

  private async onFormSubmit(e: Event): Promise<void> {
    e.preventDefault();
    this.register();
  }

  private async register(): Promise<void> {
    if (!(await isFormValid(this.form))) {
      return;
    }

    const formData = buildFormData<INewCustomer>(this.form);
    const result = await AuthService.register(formData);
    this.handleRegisterResult(result);
  }

  private async handleRegisterResult(result: AuthResult): Promise<void> {
    if (!(result instanceof Error)) {
      router.navigate(Route.Home);
    } else {
      this.msgPara.textContent = 'Something went wrong, try again later';
    }
  }
}

export default PageReg;

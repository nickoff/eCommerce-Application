/* eslint-disable max-lines-per-function */
import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { render } from '@shared/utils/misc';
import cx from 'clsx';
import { type FormControlType } from '@shared/types';
import { Route, router } from '@app/router';
import { isFormValid, buildFormData } from '@shared/utils/form-helpers';
import { qs } from '@shared/utils/dom-helpers';
import { INewCustomer } from '@shared/interfaces/customer.interface';
import AuthService from '@app/auth.service';
import { AddressType } from '@shared/enums/address.enum';
import { PageTitle } from '@pages/page-title.decorator';
import { btn, btnFilled } from '../../styles/shared/index.module.scss';
import * as s from './registration.module.scss';
import { controls as c, newAdressControls } from './config';

@PageTitle('Sign Up')
class PageReg extends Component {
  private billingControls: FormControlType[];

  private addressToggler: HTMLInputElement;

  private form!: HTMLFormElement;

  private msgPara!: HTMLParagraphElement;

  constructor() {
    super();
    this.billingControls = newAdressControls(AddressType.Billing);

    this.addressToggler = document.createElement('input');
    this.addressToggler.type = 'checkbox';
    this.addressToggler.name = 'useShippingAddress';
  }

  componentDidRender(): void {
    this.form = qs('form', this.getContent());
    this.msgPara = qs(`.${s.regMsg}`, this.getContent());
    this.addressToggler.addEventListener('change', () => this.toggleControls(this.billingControls));
  }

  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h2 className={s.heading}>Please sign up to continue</h2>
        <form className={s.form}>
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
          <button className={cx(btn, btnFilled, s.submitBtn)} onclick={this.onFormSubmit.bind(this)}>
            SIGN UP
          </button>
        </form>
        <p className={s.regMsg}></p>
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

    if (!(await isFormValid(this.form))) {
      return;
    }

    const formData = buildFormData<INewCustomer>(this.form);

    AuthService.register(formData, () => {
      this.msgPara.textContent = "You've signed up";
      setTimeout(() => router.navigate(Route.Home), 500);
    });
  }
}

export default PageReg;

/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */
import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { render } from '@shared/utils/misc';
import Button from '@components/shared/ui/button/button';
import { type FormControlType } from '@shared/types';
import Route from '@app/router/routes';
import { isFormValid, buildFormData } from '@shared/utils/form-helpers';
import { qs } from '@shared/utils/dom-helpers';
import { INewCustomer } from '@shared/interfaces/customer.interface';
import AuthService from '@app/auth.service';
import s from './registration.module.scss';
import { controls as c, newAdressControls } from './config';

class PageReg extends Component {
  private billingControls: FormControlType[];

  private addressToggler: HTMLInputElement;

  private form!: HTMLFormElement;

  private msgPara!: HTMLParagraphElement;

  constructor() {
    super();
    this.billingControls = newAdressControls('Billing');

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
            {render(newAdressControls('Shipping'))}
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
          <p className={s.para}>
            Already registered?{' '}
            <a href={Route.Login} attributes={{ 'data-navigo': '' }}>
              Sign In
            </a>
          </p>
          <Button className={s.submitBtn} onClick={this.onFormSubmit.bind(this)} content={'Sign Up'} />
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
    });

    console.log(formData);
  }
}

export default PageReg;

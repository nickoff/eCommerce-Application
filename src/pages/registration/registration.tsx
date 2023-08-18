/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */
import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { render } from '@shared/utils/misc';
import Button from '@components/shared/ui/button/button';
import { formDataBuilder } from '@shared/utils/formData-builder';
import AuthService from '@app/auth.service';
import { type FormControlType } from '@shared/types';
import Route from '@app/router/routes';
import s from './registration.module.scss';
import { controls as c, newAdressControls } from './config';

class PageReg extends Component {
  private billingControls: FormControlType[];

  private addressToggler: HTMLInputElement;

  constructor() {
    super();
    this.billingControls = newAdressControls();

    this.addressToggler = document.createElement('input');
    this.addressToggler.type = 'checkbox';
    this.addressToggler.name = 'useShippingAddress';
  }

  componentDidRender(): void {
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
            {render(newAdressControls())}
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
          <Button className={s.submitBtn} onClick={this.onClickSubmit} content={'Sign Up'} />
        </form>
      </div>
    );
  }

  private toggleControls(inputs: FormControlType[]): void {
    inputs.forEach((i) => {
      i.clear();
      i.setProps({ isDisabled: !i.getState().isDisabled, isError: false });
    });
  }

  private async onClickSubmit(e: Event): Promise<void> {
    e.preventDefault();
    if (e.target) {
      const { form } = e.target as HTMLButtonElement;
      if (form) {
        const customer = formDataBuilder(form);
        if (!customer.email) return;
        await AuthService.register(customer, (err) => console.log(err));
      }
    }
  }
}

export default PageReg;

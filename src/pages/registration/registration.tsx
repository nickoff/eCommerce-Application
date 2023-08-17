import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { render } from '@shared/utils/misc';
import Button from '@components/shared/ui/button/button';
import Routes from '@app/router/routes';
import { FormControl } from '@shared/types';
import s from './registration.module.scss';
import { controls as c, newAdressControls } from './config';

class PageReg extends Component {
  private billingControls: FormControl[];

  private addressToggler: HTMLInputElement;

  constructor() {
    super();
    this.billingControls = newAdressControls();

    this.addressToggler = document.createElement('input');
    this.addressToggler.type = 'checkbox';
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
            <a href={Routes.Login} attributes={{ 'data-navigo': '' }}>
              Sign In
            </a>
          </p>
          <Button className={s.submitBtn} onClick={(): null => null} content={'Sign Up'} />
        </form>
      </div>
    );
  }

  private toggleControls(inputs: FormControl[]): void {
    inputs.forEach((i) => {
      i.clear();
      i.setProps({ isDisabled: !i.getState().isDisabled, isError: false });
    });
  }
}

export default PageReg;

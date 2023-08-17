import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { render } from '@shared/utils/misc';
import { Input } from '@components/shared/ui/input/input';
import Button from '@components/shared/ui/button/button';
import Route from '@app/router/routes';
import s from './registration.module.scss';
import { controls as c, newAdressControls } from './config';

class PageReg extends Component {
  private billingInputs: Input[];

  private addressToggler: HTMLInputElement;

  constructor() {
    super();
    this.billingInputs = newAdressControls();

    this.addressToggler = document.createElement('input');
    this.addressToggler.type = 'checkbox';
  }

  componentDidRender(): void {
    this.addressToggler.addEventListener('change', () => this.toggleInputs(this.billingInputs));
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
            {render(newAdressControls())}
          </div>
          <div className={s.billing}>
            <h3 className={s.addressHeading}>Billing Address</h3>
            <label className={s.billingLabel}>Use shipping address {this.addressToggler}</label>
            {render(this.billingInputs)}
          </div>
          <p className={s.para}>
            Already registered?{' '}
            <a href={Route.Login} attributes={{ 'data-navigo': '' }}>
              Sign In
            </a>
          </p>
          <Button className={s.submitBtn} onClick={(): null => null} content={'Sign Up'} />
        </form>
      </div>
    );
  }

  private toggleInputs(inputs: Input[]): void {
    inputs.forEach((i) => {
      i.clear();
      i.setProps({ isDisabled: !i.getState().isDisabled, isError: false });
    });
  }
}

export default PageReg;

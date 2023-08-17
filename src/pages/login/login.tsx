import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { Input } from '@components/shared/ui/input/input';
import { InputName } from '@shared/enums/input.enum';
// import cx from 'clsx';
import Button from '@components/shared/ui/button/button';
import Route from '@app/router/routes';
import s from './login.module.scss';

import LoginPageText from './config';

const emailInput = new Input({
  name: InputName.Email,
  labelText: LoginPageText.LableForEmail,
});

const pasInput = new Input({
  name: InputName.Password,
  labelText: LoginPageText.LableForPas,
});

class PageLogin extends Component {
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
          <Button onClick={(): null => null} content={'Sign In'} />
        </form>
      </div>
    );
  }
}

export default PageLogin;

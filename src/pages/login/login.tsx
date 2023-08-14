import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { Input } from '@components/shared/ui/input/Input';
import { InputName } from '@shared/enums/input.enum';
import './login.scss';

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
      <form className="form-login sign-wrapper hidden" action=" ">
        <h2 className="page-title">{LoginPageText.Title}</h2>
        {emailInput.render()}
        {pasInput.render()}
        <span className="sign-text sign-text__up">
          <a className="sign-link sign-link__up" href="#">
            {LoginPageText.Link}
          </a>
        </span>
        <button className="sign-btn sign-btn__in" type="submit">
          {LoginPageText.Button}
        </button>
      </form>
    );
  }
}

export default PageLogin;

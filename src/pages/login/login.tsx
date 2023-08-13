import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { Input } from '@components/shared/ui/input/Input';
import { InputNames } from '@shared/enums/input.enum';

import LoginPageText from './config';
import './login.scss';

const emailInput = new Input({
  name: InputNames.email,
  labelText: 'Your email address',
});

const pasInput = new Input({
  name: InputNames.password,
  labelText: 'Your password',
});

class PageLogin extends Component {
  render(): JSX.Element {
    return (
      <div className="page-login sign-wrapper hidden">
        <h2 className="page-title">{LoginPageText.Title}</h2>
        {emailInput.render()}
        {pasInput.render()}
        <span className="sign-text sign-text__up">
          <a className="sign-link sign-link__up" href="#">
            {LoginPageText.Link}
          </a>
        </span>
        <button className="sign-btn sign-btn__in">{LoginPageText.Button}</button>
      </div>
    );
  }
}

export default PageLogin;

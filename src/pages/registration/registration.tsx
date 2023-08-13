import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { Input } from '@components/shared/ui/input/Input';
import { InputNames } from '@shared/enums/input.enum';
import './registration.scss';

import { RegPageText, InputItems } from './config';

const emailInput = new Input({
  name: InputNames.email,
  labelText: RegPageText.LableForEmail,
});

const pasInput = new Input({
  name: InputNames.password,
  labelText: RegPageText.LableForPas,
});

const firstNameInput = new Input({
  name: InputNames.password,
  labelText: RegPageText.LableForFirstName,
});

const lastNameInput = new Input({
  name: InputNames.password,
  labelText: RegPageText.LableForLastName,
});

const dateOfBrithInput = new Input({
  name: InputNames.password,
  labelText: RegPageText.LableForDateOfBirth,
});

class PageReg extends Component {
  render(): JSX.Element {
    return (
      <form className="form-reg sign-wrapper hidden">
        <h2 className="page-title">{RegPageText.Title}</h2>
        {emailInput.render()}
        {pasInput.render()}
        {firstNameInput.render()}
        {lastNameInput.render()}
        {dateOfBrithInput.render()}
        <div className="adress adress-shiping">
          <h4>shiping adress</h4>
        </div>
        <span className="sign-text sign-text__up">
          <a className="sign-link sign-link__up" href="#">
            {RegPageText.Link}
          </a>
        </span>
        <button className="sign-btn sign-btn__up" type="submit">
          {RegPageText.Button}
        </button>
      </form>
    );
  }
}

export default PageReg;

import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { Input } from '@components/shared/ui/input/Input';
import { InputNames } from '@shared/enums/input.enum';

import RegPageText from './config';

const emailInput = new Input({
  name: InputNames.email,
  labelText: 'Your email address',
});

const pasInput = new Input({
  name: InputNames.password,
  labelText: 'Your password',
});

class PageReg extends Component {
  render(): JSX.Element {
    return (
      <div className="page-reg sign-wrapper hidden">
        <h2 className="page-title">{RegPageText.Title}</h2>
        {emailInput.render()}
        {pasInput.render()}
        <span className="sign-text sign-text__up">
          <a className="sign-link sign-link__up" href="#">
            {RegPageText.Link}
          </a>
        </span>
        <button className="sign-btn sign-btn__up">{RegPageText.Button}</button>
      </div>
    );
  }
}

export default PageReg;

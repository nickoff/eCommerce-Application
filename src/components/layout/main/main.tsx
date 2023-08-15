import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import './main.scss';
import PageLogin from '@pages/login/login';
import PageReg from '@pages/registration/registration';

import { SharedCSSClass } from '@shared/constants/shared-css-class';

class Main extends Component {
  render(): JSX.Element {
    return (
      <div className="main-wrapper">
        <main className={`main ${SharedCSSClass.Container}`}>
          {new PageLogin().render()}
          {new PageReg().render()}
        </main>
      </div>
    );
  }
}

export default Main;

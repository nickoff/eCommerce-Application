import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import './main.scss';
import PageLogin from '@pages/login/login';

import { SharedCSSClass } from '@shared/constants/shared-css-class';

class Main extends Component {
  render(): JSX.Element {
    return (
      <div className="main-wrapper">
        <main className={`main ${SharedCSSClass.Container}`}>{new PageLogin().render()}</main>
      </div>
    );
  }
}

export default Main;

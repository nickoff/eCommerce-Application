import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import cx from 'clsx';
import './main.scss';

import { SharedCSSClass } from '@shared/constants/shared-css-class';

interface IMainProps extends IProps {
  page: Component;
}

class Main extends Component<IMainProps> {
  render(): JSX.Element {
    return (
      <div>
        <main className={cx(SharedCSSClass.Container)}>{this.props.page?.render()}</main>
      </div>
    );
  }
}

export default new Main();

import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { container } from '../../../styles/shared/index.module.scss';
import * as s from './main.module.scss';

interface IMainProps extends IProps {
  page: Component;
}

class Main extends Component<IMainProps> {
  render(): JSX.Element {
    return (
      <div className={s.mainWrapper}>
        <main className={container}>{this.props.page?.render()}</main>
      </div>
    );
  }
}

export default new Main();

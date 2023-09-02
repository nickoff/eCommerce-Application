import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import cx from 'clsx';
import { container } from '../../../styles/shared/index.module.scss';
import * as s from './main.module.scss';

interface IMainProps extends IProps {
  page: Component;
}

class Main extends Component<IMainProps> {
  render(): JSX.Element {
    return (
      <div className={s.mainWrapper}>
        <main className={cx(s.main, container)}>{this.props.page?.render()}</main>
      </div>
    );
  }
}

export default new Main();

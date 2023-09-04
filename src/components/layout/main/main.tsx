import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import cx from 'clsx';
import Breadcrumps from './breadcrumps/breadcrumps';
import { container } from '../../../styles/shared/index.module.scss';
import * as s from './main.module.scss';
import { IMainProps } from './main.interface';

class Main extends Component<IMainProps> {
  render(): JSX.Element {
    const { breadcrumpsPath: path, showBreadcrumps } = this.props;

    return (
      <div className={s.mainWrapper}>
        <main className={cx(s.main, container)}>
          {showBreadcrumps && path && new Breadcrumps({ path, className: s.mainBreadcrumps }).render()}
          {this.props.page?.render()}
        </main>
      </div>
    );
  }
}

export default new Main();

import { element } from 'tsx-vanilla';
import Component from '@shared/component';
// import cx from 'clsx';
import { Route } from '@app/router';
import * as s from './page404.module.scss';

class Page404 extends Component {
  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <div>
          <h1 className={s.code}>404</h1>
          <p className={s.notFound}>Page not found</p>
          <p className={s.goBack}>
            Go back <a href={Route.Home}>Home</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Page404;

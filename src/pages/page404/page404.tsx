import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import { Route } from '@app/router';
import { PageTitle } from '@pages/page-title.decorator';
import * as s from './page404.module.scss';

@PageTitle('404')
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

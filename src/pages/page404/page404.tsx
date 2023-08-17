import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import cx from 'clsx';
import Route from '@app/router/routes';
import s from './page404.module.scss';
import ErrorPageText from './config';

class Page404 extends Component {
  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <div className={s.pagePic}></div>
        <h2 className={s.pageTitle}>{ErrorPageText.Title}</h2>
        <a className={cx('home-link')} href={Route.Home} attributes={{ 'data-navigo': '' }}>
          {ErrorPageText.Link}
        </a>
      </div>
    );
  }
}

export default Page404;

import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import cx from 'clsx';
import Routes from '@app/router/routes';
import s from './error.module.scss';
import ErrorPageText from './config';

class PageError extends Component {
  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <div className={s.pagePic}></div>
        <h2 className={s.pageTitle}>{ErrorPageText.Title}</h2>
        <a className={cx('home-link')} href={Routes.Home} attributes={{ 'data-navigo': '' }}>
          {ErrorPageText.Link}
        </a>
      </div>
    );
  }
}

export default PageError;

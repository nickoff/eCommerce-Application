import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import { PageTitle } from '@pages/page-title.decorator';
import { SITE_TITLE } from '@shared/constants/seo';
import { Route } from '@app/router';
import * as s from './home.module.scss';
import HomePageText from './config';

@PageTitle(SITE_TITLE, true)
class PageHome extends Component {
  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h2 className={s.pageTitle}>{HomePageText.Title}</h2>
        <div className={s.links}>
          <a href={Route.Login} dataset={{ navigo: '' }}>
            Sign In
          </a>
          <a href={Route.Registration} dataset={{ navigo: '' }}>
            Sing Up
          </a>
        </div>
      </div>
    );
  }
}

export default PageHome;

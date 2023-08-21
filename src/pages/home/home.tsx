import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import { PageTitle } from '@pages/page-title.decorator';
import { SITE_TITLE } from '@shared/constants/seo';
import * as s from './home.module.scss';
import HomePageText from './config';

@PageTitle(SITE_TITLE, true)
class PageHome extends Component {
  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h2 className={s.pageTitle}>{HomePageText.Title}</h2>
      </div>
    );
  }
}

export default PageHome;

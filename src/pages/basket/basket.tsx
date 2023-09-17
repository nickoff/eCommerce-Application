import { element } from 'tsx-vanilla';
import { PageTitle } from '@pages/page-title.decorator';
import { Component } from '@shared/lib';
import * as s from './basket.module.scss';

@PageTitle('Basket')
class BasketPage extends Component {
  render(): JSX.Element {
    return <div className={s.basketPage}>Basket</div>;
  }
}

export default BasketPage;

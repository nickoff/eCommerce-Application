import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { PageTitle } from '@pages/page-title.decorator';
import { Component } from '@shared/lib';
import store from '@app/store/store';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { btn } from '@styles/shared/index.module.scss';
import CartRepoService from '@shared/api/cart/cart-repo.service';
import * as s from './basket.module.scss';
import { BasketPageText } from './config';

@PageTitle('Basket')
class BasketPage extends Component {
  private cartId = store.getState().cart?.id;

  render(): JSX.Element {
    return (
      <div className={s.basketPageHeader}>
        <h3>{BasketPageText.Title}</h3>
        <button className={cx(btn)} onclick={this.onRemoveAllCartClick.bind(this)}>
          {BasketPageText.BntRemoveAll}
        </button>
      </div>
    );
  }

  private async onRemoveAllCartClick(): Promise<void> {
    const versionCart = store.getState().cart?.version;

    if (!versionCart || !this.cartId) return;
    const removeCart = await CartRepoService.removeAllCart(store.apiRoot, this.cartId, versionCart);
    const newCart = await CartRepoService.createMeCart(store.apiRoot, { currency: 'USD', country: 'BY' });
    const activeCart = await CartRepoService.getMyActiveCart(store.apiRoot);
    if (!isHttpErrorType(removeCart) && !isHttpErrorType(newCart) && !isHttpErrorType(activeCart)) {
      store.setState({ cart: activeCart });
    }
  }
}

export default BasketPage;

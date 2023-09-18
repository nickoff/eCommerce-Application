import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { PageTitle } from '@pages/page-title.decorator';
import { Component } from '@shared/lib';
import store from '@app/store/store';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { btn } from '@styles/shared/index.module.scss';
import CartRepoService from '@shared/api/cart/cart-repo.service';
import * as s from './basket.module.scss';
import { BasketPageText, linksConfig } from './config';

@PageTitle('Basket')
class BasketPage extends Component {
  constructor(...args: IProps[]) {
    super(...args);
    store.subscribe('cart', this);
  }

  private cartId = store.getState().cart?.id;

  render(): JSX.Element {
    const { cart } = store.getState();
    return (
      <div className={s.basketPageWrapper}>
        <div className={s.basketPageHeader}>
          <h3>{BasketPageText.Title}</h3>
          {cart && cart?.lineItems.length > 0 && (
            <button className={cx(btn)} onclick={this.onRemoveAllCartClick.bind(this)}>
              {BasketPageText.BntRemoveAll}
            </button>
          )}
        </div>
        {cart && cart?.lineItems.length ? <div>1</div> : this.emptyCart()}
      </div>
    );
  }

  private emptyCart(): JSX.Element {
    return (
      <div className={s.basketEmpty}>
        <p className={cx(s.basketEmptyArticle)}>{BasketPageText.EmptyCart}</p>
        <ul className={cx(s.basketEmptyNavList)}>
          {linksConfig.map((link) => (
            <li className={cx(s.basketEmptyNavItem)}>
              <a className={cx(s.basketEmptyNavLink)} href={link.route} dataset={{ navigo: '' }}>
                {link.text}
              </a>
            </li>
          ))}
        </ul>
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

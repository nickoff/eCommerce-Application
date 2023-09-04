/* eslint-disable max-lines-per-function */
import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component, Child } from '@shared/lib';
import Backdrop from '@components/shared/ui/backdrop/backdrop';
import Main from '@components/layout/main/main';
import CrossIcon from '@assets/icons/cross-lg-icon.element.svg';
import { toggleScrollCompensate, qs } from '@shared/utils/dom-helpers';
import ProductRepoService from '@shared/api/product/product-repo.service';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { Category, ProductType } from '@commercetools/platform-sdk';
import { LANG_CODE } from '@shared/constants/misc';
import Product from '@components/entities/product/product';
import * as s from './search-bar.module.scss';
import SearchIcon from './search-icon.element.svg';
import { navLink } from '../common.module.scss';
import { container } from '../../../../styles/shared/index.module.scss';
import Logo from '../logo/logo';

class SearchModal extends Component {
  @Child(s.searchModal) private searchModal!: HTMLElement;

  @Child(s.searchModalInput) private searchInput!: HTMLInputElement;

  @Child(s.searchModalLogo) private logo!: HTMLElement;

  private searchResultsContainer: JSX.Element | null = null;

  private backdrop = new Backdrop({ onclick: this.hideModal.bind(this) });

  private scrollWidth!: number;

  protected componentDidRender(): void {
    Main.afterRender((main) => main.getContent().append(this.backdrop.render()));
    this.logo.addEventListener('click', this.hideModal.bind(this));
  }

  render(): JSX.Element {
    return (
      <div>
        <button id="searchbar-toggle" className={cx(s.searchToggle, navLink)} onclick={this.showModal.bind(this)}>
          {SearchIcon}
        </button>

        <div className={cx(s.searchModal)}>
          <div className={s.searchModalLogoWrapper}>
            <div className={container}>
              <Logo className={s.searchModalLogo} />
            </div>
          </div>

          <div className={cx(s.searchModalInputWrapper)}>
            <div className={container}>
              <div className={cx(s.searchModalInputContainer)}>
                <button className={s.searchBtn}>{SearchIcon.cloneNode(true)}</button>
                <input
                  className={s.searchModalInput}
                  onchange={this.search.bind(this)}
                  type="text"
                  placeholder="Search..."
                />
                <button className={s.closeBtn} onclick={this.hideModal.bind(this)}>
                  {CrossIcon.cloneNode(true)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderResults(products: Product[], vendors: Category[], types: ProductType[]): JSX.Element {
    if (!products.length && !vendors.length && !types.length) {
      return (
        <div className={s.searchResultsContainer}>
          <p className={s.noResultPara}>No results</p>
        </div>
      );
    }

    return (
      <div className={cx(s.searchResultsContainer, 'row')}>
        <div className={cx(s.searchResults, 'col-12', 'col-sm-6', 'col-md-5')}>
          <p className={s.searchResultsHeading}>Categories</p>
          {!!vendors.length && <p className={s.categoryNamePara}>Vendor</p>}
          <ul className={s.searchResultsList}>
            {!!vendors.length &&
              vendors.map((v) => (
                <li>
                  <a href={`/${v.slug[LANG_CODE]}`} className={s.searchResultsLink} dataset={{ navigo: '' }}>
                    {v.name[LANG_CODE]}
                  </a>
                </li>
              ))}
          </ul>
          {!!types.length && <p className={s.categoryNamePara}>Type</p>}
          <ul className={s.searchResultsList}>
            {!!types.length &&
              types.map((t) => (
                <li>
                  <a href={`/${t.key}`} className={s.searchResultsLink} dataset={{ navigo: '' }}>
                    {t.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <div className={cx(s.searchResults, 'col-12', 'col-sm-6', 'col-md-5')}>
          <p className={s.searchResultsHeading}>Suggested products</p>
          <ul className={s.searchResultsList}>
            {!!products.length &&
              products.map((p) => (
                <li>
                  <a className={s.searchResultsLink} href={p.detailsPath} dataset={{ navigo: '' }}>
                    <img src={p.images[0].url} alt={p.images[0].label} />
                    <span>{p.name}</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  private updateResults(products: Product[], vendors: Category[], types: ProductType[]): void {
    const newSearchResultsEl = this.renderResults(...[products, vendors, types]);

    if (this.searchResultsContainer) {
      this.searchResultsContainer.replaceWith(newSearchResultsEl);
    } else {
      qs(`.${s.searchModalInputWrapper} .${container}`, this.getContent()).append(newSearchResultsEl);
    }

    this.searchResultsContainer = newSearchResultsEl;
  }

  private async search(): Promise<void> {
    const text = this.searchInput.value;
    const response = await ProductRepoService.searchProductsWithCategories(text);

    if (isHttpErrorType(response)) {
      return;
    }

    this.updateResults(...response);
  }

  private showModal(): void {
    this.scrollWidth = toggleScrollCompensate();
    this.searchModal.classList.add(s.show);
    this.backdrop.show();
    this.searchInput.focus();
  }

  private hideModal(): void {
    this.searchModal.style.cssText += `--scrollbar-compensate:${this.scrollWidth}px`;
    this.searchModal.classList.add(s.closing);
    this.backdrop.hide();
    toggleScrollCompensate();

    this.searchModal.addEventListener(
      'animationend',
      () => {
        this.searchModal.classList.remove(s.show, s.closing);
        this.searchInput.value = '';

        if (this.searchResultsContainer) {
          this.searchResultsContainer.remove();
          this.searchResultsContainer = null;
        }
      },
      { once: true },
    );
  }
}

export default SearchModal;

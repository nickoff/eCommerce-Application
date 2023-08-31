import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component, Child } from '@shared/lib';
import Backdrop from '@components/shared/ui/backdrop/backdrop';
import Main from '@components/layout/main/main';
import CrossIcon from '@assets/icons/cross-lg-icon.element.svg';
import * as s from './search-bar.module.scss';
import SearchIcon from './search-icon.element.svg';
import { navLink } from '../common.module.scss';
import { container } from '../../../../styles/shared/index.module.scss';
import Logo from '../logo/logo';

class SearchModal extends Component {
  @Child(s.searchModal) private searchModal!: HTMLElement;

  @Child(s.searchModalInput) private searchInput!: HTMLInputElement;

  private backdrop = new Backdrop({ onclick: this.hideModal.bind(this) });

  protected componentDidRender(): void {
    Main.afterRender((main) => main.getContent().append(this.backdrop.render()));
  }

  render(): JSX.Element {
    return (
      <div>
        <button className={cx(s.searchToggle, navLink)} onclick={this.showModal.bind(this)}>
          {SearchIcon}
        </button>

        <div className={cx(s.searchModal)}>
          <div className={s.searchModalLogoWrapper}>
            <div className={container}>
              <Logo />
            </div>
          </div>

          <div className={cx(s.searchModalInputWrapper)}>
            <div className={container}>
              <div className={cx(s.searchModalInputContainer)}>
                <button className={s.searchBtn}>{SearchIcon.cloneNode(true)}</button>
                <input className={s.searchModalInput} type="text" placeholder="Search..." />
                <button className={s.closeBtn} onclick={this.hideModal.bind(this)}>
                  {CrossIcon.cloneNode(true)}
                </button>
              </div>

              <div className={s.searchResultsContainer}>
                <div className={s.searchResults}>
                  <p className={s.searchResultsHeading}>Filters</p>
                </div>
                <div className={s.searchResults}>
                  <p className={s.searchResultsHeading}>Suggested products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private showModal(): void {
    this.searchModal.classList.add(s.show);
    this.backdrop.show();
  }

  private hideModal(): void {
    this.searchModal.classList.add(s.closing);
    this.backdrop.hide();

    this.searchModal.addEventListener(
      'animationend',
      () => {
        this.searchModal.classList.remove(s.show, s.closing);
        this.searchInput.value = '';
      },
      { once: true },
    );
  }
}

export default SearchModal;

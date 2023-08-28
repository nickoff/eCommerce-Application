import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component, Child } from '@shared/lib';
import ProductListService from '@shared/api/product/product-list.service';
import Store from '@app/store/store';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { IFilterBy, ISortBy } from '@shared/interfaces';
import Backdrop from '@components/shared/ui/backdrop/backdrop';
import * as s from './catalog.module.scss';
import Toolbar from './toolbar/toolbar';
import FilterTree from './filter-tree/filter-tree';
import { ToolbarEvent } from './toolbar/toolbar.enum';
import { ICatalogProps } from './catalog.interface';
import ProductCollection from './product-collection/product-collection';

class CatalogPage extends Component<ICatalogProps> {
  @Child(s.productsFilterTree) private filterTree!: HTMLElement;

  private backdrop = new Backdrop({ onclick: this.hideFilterWindow.bind(this) });

  private prodCollection = new ProductCollection();

  private sorting?: ISortBy;

  private filter?: IFilterBy;

  protected componentDidRender(): void {
    this.getContent().addEventListener(ToolbarEvent.LayoutChange, ({ detail }) =>
      this.prodCollection.changeLayout(detail.layout),
    );

    this.getContent().addEventListener(ToolbarEvent.SoringChange, ({ detail }) => this.onSortingChange(detail));

    this.getContent().addEventListener(ToolbarEvent.FilterOpen, this.showFilterWindow.bind(this));
  }

  private showFilterWindow(): void {
    this.filterTree.classList.add(s.show);
    this.backdrop.show();
  }

  private hideFilterWindow(): void {
    this.filterTree.classList.remove(s.show);
  }

  private onSortingChange(sortData: ISortBy): void {
    this.sorting = sortData;
    this.load();
  }

  render(): JSX.Element {
    this.load();
    const { category } = this.props;

    return (
      <div className={s.catalogContainer}>
        {new FilterTree({ category, onFilterChange: this.load.bind(this), className: s.productsFilterTree }).render()}
        <div className={cx(s.productsContainer, 'container-fluid')}>
          {new Toolbar({ className: s.productsToolbar }).render()}
          {this.prodCollection.render()}
        </div>
        {this.backdrop.render()}
      </div>
    );
  }

  private async load(filter?: IFilterBy): Promise<void> {
    if (filter) {
      this.filter = filter;
    }

    const { apiRoot } = Store.getState();
    const { category } = this.props;

    const productsData = await ProductListService.getProductsWithFilter(
      apiRoot,
      this.filter ?? { category },
      this.sorting,
    );

    if (!isHttpErrorType(productsData)) {
      this.prodCollection.setProps({ productsData });
    }
  }
}

export default CatalogPage;

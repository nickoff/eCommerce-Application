import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component, Child } from '@shared/lib';
import { IRangeFilter, ISortBy, IFilters } from '@shared/interfaces';
import Backdrop from '@components/shared/ui/backdrop/backdrop';
import { SITE_TITLE } from '@shared/constants/seo';
import { FilterName } from '@shared/enums';
import { Category, ProductType } from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import ProductSearchService from '@shared/api/product/product-search.service';
import { isHttpErrorType } from '@shared/utils/type-guards';
import * as s from './catalog.module.scss';
import Toolbar from './toolbar/toolbar';
import FilterTree from './filter-tree/filter-tree';
import { ToolbarEvent } from './toolbar/toolbar.enum';
import { ICatalogProps, ICatalogData } from './catalog.interface';
import ProductCollection from './product-collection/product-collection';
import { FilterBlockEvent, FilterChangeEvent } from './filter-tree/filter-block/filter-block.types';
import FilterObserver from './filter-observer';

class CatalogPage extends Component<ICatalogProps> {
  @Child(s.productsFilterTree) private filterTreeEl!: HTMLElement;

  private filterTree = new FilterTree({
    filters: this.props.catalogData.filters,
    includeTypeFilter: this.props.includeTypeFilter,
    className: s.productsFilterTree,
  });

  private backdrop = new Backdrop({ onclick: this.hideFilterWindow.bind(this) });

  private prodCollection = new ProductCollection({ productsData: this.props.catalogData.products });

  private appliedSorting?: ISortBy;

  private appliedFilters: IFilters = {
    [FilterName.Vendor]: [],
    [FilterName.Type]: [],
    [FilterName.Color]: [],
    [FilterName.PriceRange]: {} as IRangeFilter,
  };

  private facets = this.props.catalogData.filters;

  private lastAppliedFilter: FilterName[] = [];

  constructor(props: ICatalogProps) {
    super(props);
    document.title = this.props.pageTitle ?? `Catalog | ${SITE_TITLE}`;

    const { selectedFilters } = this.props.catalogData;

    if (selectedFilters) {
      Object.assign(this.appliedFilters, selectedFilters);
    }

    this.facets = new Proxy(this.facets, {
      set: (target, property: FilterName, newVal): boolean => {
        Reflect.set(target, property, newVal);
        FilterObserver.emit('filterchange', { filterName: property, fitlerData: newVal });
        return true;
      },
    });
  }

  protected componentDidRender(): void {
    this.getContent().addEventListener(ToolbarEvent.LayoutChange, ({ detail }) =>
      this.prodCollection.changeLayout(detail.layout),
    );

    this.getContent().addEventListener(ToolbarEvent.SoringChange, ({ detail }) => this.onSortingChange(detail));

    this.getContent().addEventListener(ToolbarEvent.FilterOpen, this.showFilterWindow.bind(this));

    this.getContent().addEventListener(FilterBlockEvent.FilterChange, ({ detail }) => this.onFilterChange(detail));
  }

  render(): JSX.Element {
    return (
      <div className={s.catalogContainer}>
        {this.filterTree.render()}
        <div className={cx(s.productsContainer, 'container-fluid')}>
          {new Toolbar({ className: s.productsToolbar }).render()}
          {this.prodCollection.render()}
        </div>
        {this.backdrop.render()}
      </div>
    );
  }

  private async onFilterChange(event: FilterChangeEvent): Promise<void> {
    this.updateAppliedFilters(event);
    const catalogData = await this.load();

    if (isHttpErrorType(catalogData)) {
      return;
    }

    this.prodCollection.setProps({ productsData: catalogData?.products });

    Object.assign(this.facets, catalogData?.filters);
  }

  private updateAppliedFilters(event: FilterChangeEvent): void {
    const { filterName } = event.payload.filterBlock.getState();

    const field = this.appliedFilters[filterName];

    if (Array.isArray(field)) {
      if (event.payload.status) {
        field.push(event.payload.filter as Category & ProductType & string);
        this.lastAppliedFilter?.push(filterName);
      } else {
        const filterIndex = field.findIndex((f) => f === event.payload.filter);
        field.splice(filterIndex, 1);
        this.lastAppliedFilter?.pop();
      }

      return;
    }

    if (event.payload.status) {
      Object.assign(field, event.payload.filter);
      this.lastAppliedFilter?.push(filterName);
    } else {
      this.appliedFilters[filterName] = {} as string[] & Category[] & ProductType[] & IRangeFilter;
      this.lastAppliedFilter?.pop();
    }
  }

  private showFilterWindow(): void {
    this.filterTreeEl.classList.add(s.show);
    this.backdrop.show();
  }

  private hideFilterWindow(): void {
    this.filterTreeEl.classList.remove(s.show);
  }

  private async onSortingChange(sortData: ISortBy): Promise<void> {
    this.appliedSorting = sortData;
    const catalogData = await this.load();

    if (catalogData && !isHttpErrorType(catalogData)) {
      this.prodCollection.setProps({ productsData: catalogData.products });
    }
  }

  private async load(): Promise<ICatalogData | HttpErrorType | null> {
    const result = await ProductSearchService.fetchProductsWithFilters(
      this.appliedFilters,
      this.lastAppliedFilter?.at(-1),
      this.appliedSorting,
    );

    return result;
  }
}

export default CatalogPage;

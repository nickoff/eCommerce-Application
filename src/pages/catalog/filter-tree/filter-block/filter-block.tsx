import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import { Color, IRangeFilter } from '@shared/interfaces';
import { Category } from '@commercetools/platform-sdk';
import FilterObserver from '@pages/catalog/filter-observer';
import * as s from './filter-block.module.scss';
import { filterBodyMapper } from './filter-body/filter-body-mapper';
import { IFilterBlockProps } from './filter-block.interface';
import { IFilterBody } from './filter-body/filter-body.interface';

class FilterBlock extends Component<IFilterBlockProps> {
  private filterBody: IFilterBody;

  constructor(props: IFilterBlockProps) {
    super(props);
    const { type, filterData } = this.props;
    const data = filterData as Category[] & Color[] & IRangeFilter;
    this.filterBody = new filterBodyMapper[type]({ filterData: data, filterBlock: this });
  }

  protected componentDidRender(): void {
    FilterObserver.on('filterchange', (payload) => {
      if (this.props.filterName === payload.filterName) {
        const prop = { filterData: payload.fitlerData } as IProps;
        this.filterBody.setProps(prop);
      }
    });
  }

  render(): JSX.Element {
    const { heading } = this.props;
    const collapseId = `collapse_${Math.random().toFixed(4)}`;

    return (
      <div className={cx('accordion-item', s.accordionItem)}>
        <h4 className="accordion-header">
          <button
            className={cx('accordion-button', s.accordionBtn)}
            type="button"
            dataset={{ bsToggle: 'collapse', bsTarget: `#${collapseId}` }}
          >
            {heading}
          </button>
        </h4>
        <div id={collapseId} className="accordion-collapse collapse show">
          <div className={cx('accordion-body', s.accordionBody)}>{this.filterBody.render()}</div>
        </div>
      </div>
    );
  }
}

export default FilterBlock;

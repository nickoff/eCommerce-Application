import { element } from 'tsx-vanilla';
import { Component, Child } from '@shared/lib';
import { IExpandableProps } from './expandable.interface';
import * as s from './expandable.module.scss';

class Expandable extends Component<IExpandableProps> {
  private isExpanded = this.props.initExpand ?? false;

  @Child(s.expandableBtn) private expandBtn!: HTMLButtonElement;

  @Child(s.expandableContent) private expandContent!: HTMLElement;

  @Child(s.expandableLimit) private expandLimit!: HTMLElement;

  private contentHeight!: number;

  protected componentDidRender(): void {
    setTimeout(() => {
      this.contentHeight = this.expandContent.clientHeight;

      if (this.contentHeight <= this.props.maxHeight) {
        this.expandLimit.style.display = 'none';
      }
    });
  }

  render(): JSX.Element {
    const { content, initExpand, maxHeight } = this.props;

    return (
      <div
        className={s.expandableWrapper}
        style={{ maxHeight: `${initExpand ? `` : `${maxHeight}px`}` }}
        dataset={{ expanded: false }}
      >
        <div className={s.expandableContent}>{content}</div>
        <div className={s.expandableLimit}>
          <button className={s.expandableBtn} onclick={this.toggleExpand.bind(this)}>
            View more
          </button>
        </div>
      </div>
    );
  }

  private toggleExpand(): void {
    const { maxHeight } = this.props;
    this.isExpanded = !this.isExpanded;
    this.getContent().dataset.expanded = String(this.isExpanded);
    this.expandBtn.textContent = this.isExpanded ? 'View less' : 'View more';
    this.getContent().style.maxHeight = this.isExpanded ? `${this.contentHeight + 30}px` : `${maxHeight}px`;
  }
}

export default Expandable;

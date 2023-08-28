import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import * as s from './backdrop.module.scss';

import { IBackDropsProps } from './backdrop.interface';

class Backdrop extends Component<IBackDropsProps> {
  render(): JSX.Element {
    return <div className={s.backdrop} onclick={this.onClick.bind(this)}></div>;
  }

  private onClick(): void {
    this.props.onclick();
    this.hide();
  }

  show(): void {
    document.body.style.cssText = 'overflow: hidden';
    this.getContent().classList.add(s.show);
  }

  hide(): void {
    document.body.style.cssText = '';
    this.getContent().classList.add(s.closing);
    this.getContent().addEventListener(
      'animationend',
      () => {
        this.getContent().classList.remove(s.show, s.closing);
      },
      { once: true },
    );
  }
}

export default Backdrop;

import { element } from 'tsx-vanilla';
import { SharedCSSClass } from './constants/shared-css-class';

declare global {
  interface ICommonProps {
    text?: string;
    classList?: string[];
  }
}

abstract class Component<Props extends ICommonProps = ICommonProps> {
  protected element!: HTMLElement;

  protected props: Props;

  constructor(props: Props) {
    this.props = new Proxy(props, this.propChangeHandler);
    this.render = new Proxy(this.render, this.renderHandler);
  }

  componentDidRender?(): void;

  getContent(): HTMLElement {
    return this.element;
  }

  setProps(props: Props): void {
    Object.assign(this.props, props);
  }

  hide(): void {
    this.element.classList.add(SharedCSSClass.Hidden);
  }

  show(): void {
    this.element.classList.remove(SharedCSSClass.Hidden);
  }

  destroy(): void {
    this.element.remove();
  }

  private renderHandler: ProxyHandler<typeof this.render> = {
    apply: (...args) => {
      const el = Reflect.apply(...args);

      const { classList } = this.props;

      if (classList) {
        el.classList.add(...classList);
      }

      if (this.element) {
        this.element.replaceWith(el);
      }

      this.element = el;

      if (this.componentDidRender) {
        this.componentDidRender();
      }

      return el;
    },
  };

  private propChangeHandler: ProxyHandler<Props> = {
    set: (...args): boolean => {
      Reflect.set(...args);
      this.render();
      return true;
    },
  };

  abstract render(): JSX.Element;
}

export default Component;

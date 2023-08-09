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
      const element = Reflect.apply(...args);

      const { classList } = this.props;

      if (classList) {
        element.classList.add(...classList);
      }

      if (this.element) {
        this.element.replaceWith(element);
      }

      this.element = element;

      if (this.componentDidRender) {
        this.componentDidRender();
      }

      return element;
    },
  };

  private propChangeHandler: ProxyHandler<Props> = {
    set: (...args): boolean => {
      Reflect.set(...args);
      this.render();
      return true;
    },
  };

  abstract render(): HTMLElement;
}

export default Component;

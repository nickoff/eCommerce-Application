import { element } from 'tsx-vanilla';
import { SharedCSSClass } from './constants/shared-css-class';

declare global {
  interface IProps {
    text?: string;
    className?: string | string[];
  }

  interface Element {
    getComponent<T extends Component>(): T;
  }
}

/**
 * Prevents the usage of getComponent() method on all Element object except Component's instances
 */
Element.prototype.getComponent = function preventUsage(): never {
  throw new Error(
    "You can't use getComponent() method on Element object that is not a property of Component's instance",
  );
};

abstract class Component<Props extends IProps = IProps> {
  protected element!: HTMLElement;

  protected props: Props;

  constructor(props: Props = {} as Props) {
    this.props = new Proxy(props, this.propChangeHandler);
    this.render = new Proxy(this.render, this.renderHandler);
  }

  abstract render(): JSX.Element;

  componentDidRender?(): void;

  getContent(): HTMLElement {
    if (this.element) return this.element;
    throw new Error(
      'You must render Component object at least once (via Component.render()) before calling Componenet.getContent()',
    );
  }

  getState(): Readonly<Props> {
    return this.props;
  }

  setProps(props: Partial<Props>): void {
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

      const { className } = this.props;

      if (className) {
        if (typeof className === 'string') {
          el.classList.add(...className.split(' '));
        } else {
          el.classList.add(...className);
        }
      }

      if (this.element) {
        this.element.replaceWith(el);
      }

      this.element = el;

      Object.assign(this.element, { getComponent: () => this });

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
}

export default Component;

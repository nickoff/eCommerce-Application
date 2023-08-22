import { element } from 'tsx-vanilla';
import { SharedCSSClass } from '../constants/shared-css-class';
import { COMPONENT_ROOT_ATTR } from '../constants/misc';

declare global {
  interface IProps {
    text?: string;
    className?: string | string[];
  }

  interface Element {
    getComponent<T extends Component>(): T;
  }
}

type Callback<T extends Component> = (component: T) => void;

Element.prototype.getComponent = function get<T extends Component>(): T {
  const component = this.closest(`[${COMPONENT_ROOT_ATTR}]`)?.getComponent<T>();

  if (component) {
    return component;
  }

  throw new Error('Element has no reference to any Component');
};

export abstract class Component<Props extends IProps = IProps> {
  protected element!: HTMLElement;

  protected readonly props: Props;

  protected elementAttributes: Record<string, string> = {};

  protected elementClasses: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected afterRenderCallbacks: Callback<any>[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected beforeRenderCallbacks: Callback<any>[] = [];

  constructor(props: Props = {} as Props) {
    this.props = new Proxy(props, this.propChangeHandler);
    this.render = new Proxy(this.render, this.renderHandler);

    if (!this.componentDidRender) {
      this.componentDidRender = (): null => null;
    }

    this.componentDidRender = new Proxy(this.componentDidRender, {
      apply: (...args): void => {
        this.beforeRenderCallbacks.forEach((cb) => cb(this));
        Reflect.apply(...args);
        this.afterRenderCallbacks.forEach((cb) => cb(this));
      },
    });
  }

  abstract render(): JSX.Element;

  beforeRender(callback: Callback<this> | Callback<this>[]): void {
    this.beforeRenderCallbacks = this.beforeRenderCallbacks.concat(callback);
  }

  afterRender(callback: Callback<this> | Callback<this>[]): void {
    this.afterRenderCallbacks = this.afterRenderCallbacks.concat(callback);
  }

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

  attr(attrs: Record<string, string>): this {
    Object.assign(this.elementAttributes, attrs);

    Object.entries(attrs).forEach(([key, value]) => {
      this.element.setAttribute(key, value);
    });

    return this;
  }

  class(classes: string[] | string): this {
    let arr = classes;

    if (typeof arr === 'string') {
      arr = arr.split(' ');
    }

    this.elementClasses.push(...arr);

    if (this.element) {
      this.element.classList.add(...classes);
    }

    return this;
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

  protected componentDidRender?(): void;

  private applyClasses(): void {
    const { className } = this.props;

    if (className) {
      if (typeof className === 'string') {
        this.element.classList.add(...className.split(' '));
      } else {
        this.element.classList.add(...className);
      }
    }

    this.element.classList.add(...this.elementClasses);
  }

  private renderHandler: ProxyHandler<typeof this.render> = {
    apply: (...args) => {
      const el = Reflect.apply(...args);

      if (this.element) {
        this.element.replaceWith(el);
      }

      this.element = el;

      this.attr(this.elementAttributes);
      this.applyClasses();

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

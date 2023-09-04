import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import cx from 'clsx';
import * as s from './breadcrumps.module.scss';
import { IBreadcrumpsProps } from './breadcrumps.interface';

class Breadcrumps extends Component<IBreadcrumpsProps> {
  render(): JSX.Element {
    const { path } = this.props;

    return (
      <nav>
        <ul className={s.breadcrumpsList}>
          {path.map((p, index) => (
            <li className={cx(s.breadcrumpsItem, p.label.length > 11 && s.textTruncate)}>
              <a href={p.link} dataset={{ navigo: '' }}>
                {`${p.label}`}
              </a>
              {index === path.length - 1 ? '' : <span>{'>'}</span>}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default Breadcrumps;

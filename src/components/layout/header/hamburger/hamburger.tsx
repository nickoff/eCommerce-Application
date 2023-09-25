import { element } from 'tsx-vanilla';
import cx from 'clsx';
import * as s from './hamburger.module.scss';
import HamIcon from './hamburger-icon.element.svg';

export default function Hamburger({ className }: IProps): JSX.Element {
  return (
    <button
      className={cx('navbar-toggler', s.hamburger, className)}
      type="button"
      dataset={{ bsToggle: 'collapse', bsTarget: '#n-bar' }}
    >
      <span>{HamIcon}</span>
    </button>
  );
}

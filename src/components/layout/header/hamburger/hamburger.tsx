import { element } from 'tsx-vanilla';
import './hamburger.scss';
import HamIcon from './hamburget-icon.svg';

export default function Hamburger({ className = '' }: IProps): JSX.Element {
  return (
    <button
      className={`navbar-toggler hamburger ${className}`}
      type="button"
      dataset={{ bsToggle: 'collapse', bsTarget: '#n-bar' }}
    >
      <span>{HamIcon}</span>
    </button>
  );
}

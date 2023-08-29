import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { IButtonProps } from './button.interface';
import { ButtonVariant } from './button.enum';
import * as s from './button.module.scss';

function Button({ onClick, disabled, variant = ButtonVariant.Filled, className, content }: IButtonProps): JSX.Element {
  const classNames: Record<ButtonVariant, string> = {
    [ButtonVariant.Filled]: s.btnFilled,
    [ButtonVariant.Outline]: s.btnOutline,
    [ButtonVariant.Small]: 'missing',
  };

  return (
    <button className={cx(s.btn, classNames[variant], className)} onclick={onClick} disabled>
      {content}
    </button>
  );
}

export default Button;

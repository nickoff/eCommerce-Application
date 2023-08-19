import { ButtonVariant } from './button.enum';

export interface IButtonProps extends IProps {
  onClick: (e: Event) => void;
  content: string | JSX.Element;
  variant?: ButtonVariant;
  type?: 'submit' | 'reset' | 'button';
}

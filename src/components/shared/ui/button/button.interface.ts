import { ButtonVariant } from './button.enum';

export interface IButtonProps extends IProps {
  onClick: () => void;
  content: string | JSX.Element;
  variant?: ButtonVariant;
}

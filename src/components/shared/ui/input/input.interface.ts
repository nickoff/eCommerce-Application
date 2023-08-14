import { InputName } from '@shared/enums';

export interface IInputProps extends IProps {
  name: InputName | string;
  type?: HTMLInputElement['type'];
  isDisabled?: boolean;
  placeholder?: string;
  labelText?: string;
  isRequired?: boolean;
  isError?: boolean;
  isPassword?: boolean;
}

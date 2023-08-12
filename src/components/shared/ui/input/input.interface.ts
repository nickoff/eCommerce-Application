import { InputNames } from '@shared/enums';
import { ValidateType } from '@shared/validation';

export interface IInputProps extends IProps {
  name: InputNames;
  type?: HTMLInputElement['type'];
  isDisabled?: boolean;
  placeholder?: string;
  labelText?: string;
  isRequired?: boolean;
  isError?: boolean;
  isPassword?: boolean;
  isValidat?: ValidateType;
}

import { Schema } from 'yup';
import { InputType } from '@shared/enums';

export interface IInputProps extends IProps {
  name: string;
  type?: InputType;
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  validationSchema?: Schema | Schema[];
  additionalValidationContext?: object;
  withVisibilityToggle?: boolean;
}

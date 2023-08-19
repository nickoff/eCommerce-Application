import { InputName } from '@shared/enums';

interface IOption {
  value: string;
  content: string;
  disabled?: boolean;
}

export interface ISelectProps extends IProps {
  name: InputName | string;
  options: IOption[];
  selectedOption?: number; // index of options array;
  labelText?: string;
  disabled?: boolean;
  required?: boolean;
}

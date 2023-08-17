import { InputName } from '@shared/enums';

interface IOption {
  value: string;
  content: string;
  isDisabled?: boolean;
}

export interface ISelectProps extends IProps {
  name: InputName | string;
  options: IOption[];
  selectedOption?: number; // index of options array;
  isDisabled?: boolean;
  labelText?: string;
  isRequired?: boolean;
}

import { InputName, InputType } from '@shared/enums';
import Select from '@components/shared/ui/select/select';
import { type FormControlType } from '@shared/types';
import { Input } from '@components/shared/ui/input/input';
import * as Schema from '@shared/validation/constants/schemas.constant';

export const controls = {
  firstName: new Input({
    name: InputName.FirstName,
    label: 'First name',
    required: true,
    validationSchema: Schema.NO_SPECIAL_SCHEMA,
  }),
  lastName: new Input({
    name: InputName.LastName,
    label: 'Last name',
    required: true,
    validationSchema: Schema.NO_SPECIAL_SCHEMA,
  }),
  email: new Input({
    name: InputName.Email,
    type: InputType.Email,
    label: 'Email',
    required: true,
    validationSchema: Schema.EMAIL_UNIQUE_SCHEMA,
  }),
  password: new Input({
    name: InputName.Password,
    type: InputType.Password,
    label: 'Password',
    required: true,
    validationSchema: Schema.PASSWORD_SCHEMA,
  }),
  passwordConfirm: new Input({
    name: InputName.Password,
    type: InputType.Password,
    label: 'Confirm Password',
    required: true,
  }),
  phone: new Input({
    name: InputName.Phone,
    type: InputType.Phone,
    label: 'Phone number',
    validationSchema: Schema.PHONE_SCHEMA,
  }),
  dateOfBirth: new Input({
    name: InputName.DateOfBirth,
    type: InputType.Date,
    label: 'Date of birth',
    validationSchema: Schema.DATE_OF_BIRTH_SCHEMA,
  }),
};

export function newAdressControls(): FormControlType[] {
  return [
    new Select({
      name: InputName.Country,
      options: [
        { value: '', content: '', disabled: true },
        { value: 'RU', content: 'Russia' },
        { value: 'BY', content: 'Belarus' },
        { value: 'KZ', content: 'Kazakhstan' },
      ],
      selectedOption: 0,
      labelText: 'Country',
      required: true,
    }),
    new Input({
      name: InputName.City,
      label: 'City',
      required: true,
      validationSchema: Schema.NO_SPECIAL_SCHEMA,
    }),
    new Input({
      name: InputName.StreetName,
      label: 'Street',
      required: true,
      validationSchema: Schema.DEFAULT_STRING_SCHEMA,
    }),
    new Input({
      name: InputName.PostalCode,
      label: 'Postal code',
      required: true,
      validationSchema: Schema.POSTAL_CODE_SCHEMA,
    }),
  ];
}

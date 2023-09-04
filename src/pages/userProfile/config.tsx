/* eslint-disable no-console */
import { InputName, InputType } from '@shared/enums';
import Select from '@components/shared/ui/select/select';
import { type FormControlType } from '@shared/types';
import { Input } from '@components/shared/ui/input/input';
import * as Schema from '@shared/validation/constants/schemas.constant';
import { AddressType } from '@shared/enums/address.enum';
import { Customer } from '@commercetools/platform-sdk';
import Store from '@app/store/store';

const pwdInput = new Input({
  name: InputName.Password,
  type: InputType.Password,
  label: 'Password',
  required: true,
  withVisibilityToggle: true,
});

const confirmPwdInput = new Input({
  name: InputName.Password,
  type: InputType.Password,
  label: 'Confirm Password',
  required: true,
  withVisibilityToggle: true,
  validationSchema: Schema.PASSWORD_CONFIRM_SCHEMA,
  additionalValidationContext: { getPwdValue: pwdInput.getValue.bind(pwdInput) },
});

pwdInput.afterRender((component) => {
  component.input.addEventListener('input', () => confirmPwdInput.isValid());
});
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
    type: InputType.Text,
    label: 'Email',
    required: true,
    validationSchema: [Schema.EMAIL_SCHEMA, Schema.EMAIL_UNIQUE_SCHEMA],
  }),
  password: pwdInput,
  passwordConfirm: confirmPwdInput,
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
    required: true,
    validationSchema: Schema.DATE_OF_BIRTH_SCHEMA,
  }),
};

export function newAdressControls(variant: AddressType): FormControlType[] {
  return [
    new Select({
      name: `${InputName.Country}${variant}`,
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
      name: `${InputName.City}${variant}`,
      label: 'City',
      required: true,
      validationSchema: Schema.NO_SPECIAL_SCHEMA,
    }),
    new Input({
      name: `${InputName.StreetName}${variant}`,
      label: 'Street',
      required: true,
      validationSchema: Schema.DEFAULT_STRING_SCHEMA,
    }),
    new Input({
      name: `${InputName.PostalCode}${variant}`,
      label: 'Postal code',
      required: true,
      validationSchema: Schema.POSTAL_CODE_SCHEMA,
    }),
  ];
}

export enum UserPageText {
  CustomerError = 'Customer data is missing',
  DefAddress = 'default',
  Empty = '',
  GeneralAddress = 'General address',
}

export enum ButtonsNames {
  Edit = 'edit',
  Save = 'save',
}

export const getCustomer = (): Customer => {
  const { customer } = Store.getState();
  if (!customer) throw Error(UserPageText.CustomerError);
  return customer;
};

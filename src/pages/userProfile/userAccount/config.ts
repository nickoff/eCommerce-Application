import { InputName, InputType } from '@shared/enums';
import { Input } from '@components/shared/ui/input/input';
import * as Schema from '@shared/validation/constants/schemas.constant';
import { Customer } from '@commercetools/platform-sdk';
import Store from '@app/store/store';

export enum UserAccountText {
  Title = 'User Profile',
  Subtitle = 'Account settings',
  BtnSubmit = 'UPDATE',
  CustomerError = 'Customer data is missing',
}

const pwdInput = new Input({
  name: InputName.Password,
  type: InputType.Password,
  label: 'New password',
  required: false,
  withVisibilityToggle: true,
});

const confirmPwdInput = new Input({
  name: InputName.Password,
  type: InputType.Password,
  label: 'Confirm new password',
  required: false,
  withVisibilityToggle: true,
  validationSchema: Schema.PASSWORD_CONFIRM_SCHEMA,
  additionalValidationContext: { getPwdValue: pwdInput.getValue.bind(pwdInput) },
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
  passwordCurrent: new Input({
    name: InputName.Password,
    type: InputType.Password,
    label: 'Current password',
    required: true,
    withVisibilityToggle: true,
  }),
  dateOfBirth: new Input({
    name: InputName.DateOfBirth,
    type: InputType.Date,
    label: 'Date of birth',
    required: true,
    validationSchema: Schema.DATE_OF_BIRTH_SCHEMA,
  }),
};

export const getCustomer = (): Customer => {
  const { customer } = Store.getState();
  // eslint-disable-next-line no-console
  console.log(Store.getState().customer);
  if (!customer) throw Error(UserAccountText.CustomerError);
  return customer;
};

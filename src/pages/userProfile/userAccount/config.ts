import { InputName, InputType } from '@shared/enums';
import { Input } from '@components/shared/ui/input/input';
import * as Schema from '@shared/validation/constants/schemas.constant';

export enum UserAccountText {
  Title = 'User Profile',
  Subtitle = 'Account settings',
  BtnSubmit = 'UPDATE',
}

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

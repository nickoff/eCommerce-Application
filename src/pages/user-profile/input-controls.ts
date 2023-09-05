import { InputName, InputType } from '@shared/enums';
import { Input } from '@components/shared/ui/input/input';
import * as Schema from '@shared/validation/constants/schemas.constant';
import Store from '@app/store/store';

const currentPwdInput = new Input({
  name: 'currentPassword',
  type: InputType.Password,
  label: 'Current password',
  required: true,
  withVisibilityToggle: true,
  validationSchema: Schema.PASSWORD_SCHEMA,
});

const newPwdInput = new Input({
  name: 'newPassword',
  type: InputType.Password,
  label: 'New password',
  required: true,
  withVisibilityToggle: true,
  validationSchema: Schema.PASSWORD_SCHEMA,
});

const confirmNewPwdInput = new Input({
  name: 'newPasswordConfirm',
  type: InputType.Password,
  label: 'Confirm new password',
  required: true,
  withVisibilityToggle: true,
  validationSchema: Schema.PASSWORD_CONFIRM_SCHEMA,
  additionalValidationContext: { getPwdValue: newPwdInput.getValue.bind(newPwdInput) },
});

newPwdInput.afterRender((component) => {
  component.input.addEventListener('input', () => confirmNewPwdInput.isValid());
});

export const passwordControls = [currentPwdInput, newPwdInput, confirmNewPwdInput];

export function getUserInfoControls(): Input[] {
  const { customer } = Store.getState();

  return [
    new Input({
      name: InputName.FirstName,
      label: 'First name',
      value: customer?.firstName,
      required: true,
      validationSchema: Schema.NO_SPECIAL_SCHEMA,
    }),
    new Input({
      name: InputName.LastName,
      label: 'Last name',
      value: customer?.lastName,
      required: true,
      validationSchema: Schema.NO_SPECIAL_SCHEMA,
    }),
    new Input({
      name: InputName.DateOfBirth,
      type: InputType.Date,
      label: 'Date of birth',
      value: customer?.dateOfBirth,
      required: true,
      validationSchema: Schema.DATE_OF_BIRTH_SCHEMA,
    }),
    new Input({
      name: InputName.Email,
      type: InputType.Text,
      label: 'Email',
      value: customer?.email,
      required: true,
      validationSchema: [Schema.EMAIL_SCHEMA, Schema.EMAIL_UNIQUE_SCHEMA],
      additionalValidationContext: { currentEmail: customer?.email },
    }),
  ];
}

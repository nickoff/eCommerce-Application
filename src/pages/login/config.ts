import { Input } from '@components/shared/ui/input/input';
import { InputName, InputType } from '@shared/enums';
import { PASSWORD_SCHEMA, EMAIL_SCHEMA } from '@shared/validation/constants/schemas.constant';

export enum LoginPageText {
  Title = 'Please sign in to continue',
  Button = 'Sign In',
  Link = 'Sign up',
  LableForEmail = 'Your email address',
  LableForPas = 'Your password',
}

export const controls = {
  email: new Input({
    name: InputName.Email,
    type: InputType.Text,
    label: LoginPageText.LableForEmail,
    required: true,
    validationSchema: EMAIL_SCHEMA,
  }),

  password: new Input({
    name: InputName.Password,
    type: InputType.Password,
    label: LoginPageText.LableForPas,
    required: true,
    withVisibilityToggle: true,
    validationSchema: PASSWORD_SCHEMA,
  }),
};

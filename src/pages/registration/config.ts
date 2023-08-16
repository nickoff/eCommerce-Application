import { InputName } from '@shared/enums/input.enum';
import { Input } from '@components/shared/ui/input/input';

export const controls = {
  firstName: new Input({
    name: InputName.FirstName,
    labelText: 'First name',
    isRequired: true,
  }),
  lastName: new Input({
    name: InputName.LastName,
    labelText: 'Last name',
    isRequired: true,
  }),
  email: new Input({
    name: InputName.Email,
    labelText: 'Email address',
    isRegEmail: true,
    isRequired: true,
  }),
  password: new Input({
    name: InputName.Password,
    labelText: 'Password',
    isPassword: true,
    isRequired: true,
  }),
  passwordConfirm: new Input({
    name: InputName.Password,
    labelText: 'Confirm Password',
    noValidationRequired: true,
    isRequired: true,
  }),
  phone: new Input({
    name: InputName.Phone,
    labelText: 'Phone number',
    isRequired: true,
  }),
  dateOfBirth: new Input({
    name: InputName.DateOfBirth,
    labelText: 'Date of birth',
    isRequired: true,
  }),
};

export function newAdressControls(): Input[] {
  return [
    new Input({
      name: InputName.Country,
      labelText: 'Country',
      isRequired: true,
    }),
    new Input({
      name: InputName.City,
      labelText: 'City',
      isRequired: true,
    }),
    new Input({
      name: InputName.StreetName,
      labelText: 'Street',
      isRequired: true,
    }),
    new Input({
      name: InputName.PostalCode,
      labelText: 'Postal code',
      isRequired: true,
    }),
  ];
}

import { InputName } from '@shared/enums/input.enum';
import { Input } from '@components/shared/ui/input/input';

export const controls = {
  firstName: new Input({
    name: InputName.FirstName,
    labelText: 'First name',
  }),
  lastName: new Input({
    name: InputName.LastName,
    labelText: 'Last name',
  }),
  email: new Input({
    name: InputName.Email,
    labelText: 'Email address',
  }),
  password: new Input({
    name: InputName.Password,
    labelText: 'Password',
  }),
  passwordConfirm: new Input({
    name: InputName.Password,
    labelText: 'Confirm Password',
  }),
  phone: new Input({
    name: InputName.Phone,
    labelText: 'Phone number',
  }),
  dateOfBirth: new Input({
    name: InputName.DateOfBirth,
    labelText: 'Date of birth',
  }),
};

export function newAdressControls(): Input[] {
  return [
    new Input({
      name: InputName.Country,
      labelText: 'Country',
    }),
    new Input({
      name: InputName.City,
      labelText: 'City',
    }),
    new Input({
      name: InputName.StreetName,
      labelText: 'Street',
    }),
    new Input({
      name: InputName.PostalCode,
      labelText: 'Postal code',
    }),
  ];
}

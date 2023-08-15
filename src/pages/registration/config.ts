import { InputName } from '@shared/enums/input.enum';
import { Input } from '@components/shared/ui/input/input';

enum RegPageText {
  Title = 'Please sign up to continue',
  Button = 'Sign Up',
  Link = 'Sign in',
  Span = 'Already registered? ',
  LableForEmail = 'Email address',
  LableForPas = 'Password',
  LableForFirstName = 'First name',
  LableForLastName = 'Last name',
  LableForDateOfBirth = 'Date of birth',
  LableForStreet = 'Street',
  LableForCity = 'City',
  LableForCode = 'Postal code',
  LableForCountry = 'Country',
  LableForCheckBox = ' [ Set from shipping address ]',
  LableForPhone = 'Phone number',
  TitleShipingAddress = 'Shipping address',
  TitleBillingAddress = 'Billing address',
}

const InputItems = [
  new Input({
    name: InputName.Email,
    labelText: RegPageText.LableForEmail,
  }),
  new Input({
    name: InputName.Password,
    labelText: RegPageText.LableForPas,
  }),
  new Input({
    name: InputName.FirstName,
    labelText: RegPageText.LableForFirstName,
  }),
  new Input({
    name: InputName.LastName,
    labelText: RegPageText.LableForLastName,
  }),
  new Input({
    name: InputName.Phone,
    labelText: RegPageText.LableForPhone,
  }),
  new Input({
    name: InputName.DateOfBirth,
    labelText: RegPageText.LableForDateOfBirth,
  }),
];

const InputShippingAddressItems = [
  new Input({
    name: InputName.Country,
    labelText: RegPageText.LableForCountry,
  }),
  new Input({
    name: InputName.City,
    labelText: RegPageText.LableForCity,
  }),
  new Input({
    name: InputName.StreetName,
    labelText: RegPageText.LableForStreet,
  }),
  new Input({
    name: InputName.PostalCode,
    labelText: RegPageText.LableForCode,
  }),
];

const InputBillingAddressItems = [
  new Input({
    name: InputName.Country,
    labelText: RegPageText.LableForCountry,
  }),
  new Input({
    name: InputName.City,
    labelText: RegPageText.LableForCity,
  }),
  new Input({
    name: InputName.StreetName,
    labelText: RegPageText.LableForStreet,
  }),
  new Input({
    name: InputName.PostalCode,
    labelText: RegPageText.LableForCode,
  }),
];

export { RegPageText, InputItems, InputShippingAddressItems, InputBillingAddressItems };

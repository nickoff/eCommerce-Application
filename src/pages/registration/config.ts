import { InputNames } from '@shared/enums/input.enum';

enum RegPageText {
  Title = 'Please sign up to continue',
  Button = 'Sign Up',
  Link = 'Sign in',
  Span = 'Already registered?',
  LableForEmail = 'Enter your email address',
  LableForPas = 'Enter your password',
  LableForFirstName = 'Your first name',
  LableForLastName = 'Your last name',
  LableForDateOfBirth = 'Your date of birth',
  LableForStreet = 'Your street',
  LableForCity = 'Your city',
  LableForCode = 'Your postal code',
  LableForCountry = 'Your country',
}

const InputItems = [
  {
    name: InputNames.email,
    labelText: RegPageText.LableForEmail,
  },
  {
    name: InputNames.password,
    labelText: RegPageText.LableForPas,
  },
  {
    name: InputNames.password,
    labelText: RegPageText.LableForFirstName,
  },
  {
    name: InputNames.password,
    labelText: RegPageText.LableForLastName,
  },
  {
    name: InputNames.password,
    labelText: RegPageText.LableForDateOfBirth,
  },
];

export { RegPageText, InputItems };

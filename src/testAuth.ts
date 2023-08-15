/* eslint-disable no-console */
import AuthService from '@app/auth.service';
import { faker } from '@faker-js/faker';
import { INewCustomer, ICustomerCredentials } from '@shared/interfaces/customer.interface';
import { getRandomArrItem } from '@shared/utils/array-helpers';

function createRandomCustomer(): INewCustomer {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const dateOfBirth = faker.date.birthdate();
  const shippingAddress = {
    country: faker.location.countryCode(),
    city: faker.location.city(),
    street: faker.location.street(),
    postalCode: faker.location.zipCode(),
  };

  return { firstName, lastName, email, password, dateOfBirth, shippingAddress };
}

const savedItem = localStorage.getItem('auth-test');
const savedCredentials: ICustomerCredentials[] = savedItem ? JSON.parse(savedItem) : [];

export function registerTest(): void {
  const customer = createRandomCustomer();
  const { email, password } = customer;
  savedCredentials.push({ email, password });
  localStorage.setItem('auth-test', JSON.stringify(savedCredentials));
  AuthService.register(customer, (e) => console.log(e));
}

export function loginTest(): void {
  const credentials = getRandomArrItem(savedCredentials);

  const chance = Math.random();

  const onError = (e: Error): void => console.log(e);

  if (chance > 0.5) {
    AuthService.login(credentials, onError);
  } else {
    const fakeCredentials = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    AuthService.login(fakeCredentials, onError);
  }
}

import AddressCard from '@components/shared/ui/addressCard/addressCard';
import { getCustomer } from '../config';

export enum UserAddressesText {
  Title = 'User Profile',
  Subtitle = 'Addresses',
  BtnSubmit = 'ADD NEW ADDRESS',
}

export const getArrAddressCard = (): AddressCard[] => {
  const customer = getCustomer();
  return customer.addresses.map((el) => new AddressCard(el));
};

import AddressCard from '@components/shared/ui/addressCard/addressCard';
import { IAddressProps } from '@components/shared/ui/addressCard/addressCard.interface';
import { getCustomer } from '../config';

export enum UserAddressesText {
  Title = 'User Profile',
  Subtitle = 'Addresses',
  BtnSubmit = 'ADD NEW ADDRESS',
}

export const getArrAddressCard = (): AddressCard[] => {
  const customer = getCustomer();
  const addressesArr: AddressCard[] = customer.addresses.map((el) => {
    let newEl: IAddressProps = {
      billingAddress: false,
      shippingAddress: false,
      defaultBillingAddress: false,
      defaultShippingAddress: false,
      country: el.country,
      id: '',
    };
    if (el.id !== undefined) {
      newEl = {
        ...el,
        ...newEl,
        id: el.id,
      };
      if (customer.billingAddressIds?.includes(el.id)) newEl.billingAddress = true;
      if (customer.shippingAddressIds?.includes(el.id)) newEl.shippingAddress = true;
      if (customer.defaultBillingAddressId === el.id) newEl.defaultBillingAddress = true;
      if (customer.defaultShippingAddressId === el.id) newEl.defaultShippingAddress = true;
    }
    return new AddressCard(newEl);
  });
  return addressesArr;
};

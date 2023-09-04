export interface IAddressProps extends IProps {
  country: string;
  city?: string;
  streetName?: string;
  postalCode?: string;
  phone?: string;
  id: string;
  billingAddress: boolean;
  shippingAddress: boolean;
  defaultBillingAddress: boolean;
  defaultShippingAddress: boolean;
}

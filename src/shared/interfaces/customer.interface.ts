export interface ICustomerCredentials {
  email: string;
  password: string;
}

export interface INewCustomer extends ICustomerCredentials {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string;
  countryShipping: string;
  cityShipping: string;
  streetShipping: string;
  postalCodeShipping: string;
  countryBilling?: string;
  cityBilling?: string;
  streetBilling?: string;
  postalCodeBilling?: string;
  isDefaultShipping?: string;
  isDefaultBilling?: string;
  useShippingAddress?: 'on';
}

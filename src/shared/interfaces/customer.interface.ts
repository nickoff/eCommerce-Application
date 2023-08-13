export interface IAddress {
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface ICustomerCredentials {
  email: string;
  password: string;
}

export interface INewCustomer extends ICustomerCredentials {
  firstName: string;
  lastName: string;
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  dateOfBirth?: Date;
}

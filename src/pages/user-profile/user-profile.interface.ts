export interface IUserProfilePageProps extends IProps {
  visibleContent: 'info' | 'edit' | 'change-pwd' | 'addresses' | 'edit-address' | 'new-address';
}

export interface IUserProfileInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}

export interface IUserPwdChangeInfo {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface IAddressChangeInfo extends IAddressLocation {
  isBilling?: 'on';
  isShipping?: 'on';
  isDefaultBilling?: 'on';
  isDefaultShipping?: 'on';
}

export interface IAddressLocation {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
}

export interface IUpdateAddressActions {
  update: IAddressLocation;
  addBilling: boolean;
  addShipping: boolean;
  removeBilling: boolean;
  removeShipping: boolean;
  setDefaultBilling: boolean;
  setDefaultShipping: boolean;
}

export interface ICreateAddressActions {
  addBilling: boolean;
  addShipping: boolean;
  setDefaultBilling: boolean;
  setDefaultShipping: boolean;
}

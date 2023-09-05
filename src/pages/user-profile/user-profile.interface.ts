export interface IUserProfilePageProps extends IProps {
  visibleContent: 'info' | 'edit' | 'change-pwd' | 'addresses';
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

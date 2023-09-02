import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import * as s from './userAddresses.module.scss';
import UserProfileNav from '../userProfileNav/userProfileNav';
import { UserAddressesText } from './config';

class UserAddresses extends Component {
  render(): JSX.Element {
    return (
      <div className={s.pageWrapper}>
        <h1>{UserAddressesText.Title}</h1>
        {new UserProfileNav({ className: s.activLink }).render()}
        <div className={s.pageLayout}>
          <h2>{UserAddressesText.Subtitle}</h2>
        </div>
      </div>
    );
  }
}

export default UserAddresses;

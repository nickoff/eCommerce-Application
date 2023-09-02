import { element } from 'tsx-vanilla';
import cx from 'clsx';
import { Component } from '@shared/lib';
import { btn, btnFilled } from '@styles/shared/index.module.scss';
import AddressCard from '@components/shared/ui/addressCard/addressCard';
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
          <div className={s.addressCards}>{new AddressCard({ country: 'Belarus' }).render()}</div>
          <button className={cx(btn, btnFilled, s.submitBtn)} type="submit">
            {UserAddressesText.BtnSubmit}
          </button>
        </div>
      </div>
    );
  }
}

export default UserAddresses;

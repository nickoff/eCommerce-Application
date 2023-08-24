import { element } from 'tsx-vanilla';
import { Component } from '@shared/lib';
import Store from '@app/store/store';
import * as s from './userProfile.module.scss';

class UserProfile extends Component {
  render(): JSX.Element {
    const { customer } = Store.getState();
    // eslint-disable-next-line no-console
    console.log(customer);
    return (
      <div className={s.pageWrapper}>
        <h2>User Information</h2>
        <div className={s.dataWrapper}>
          <div className={s.dataKey}>
            <p>First Name</p>
            <p>Last Name</p>
            <p>Date Of Brith</p>
          </div>
          <div className={s.dataValuey}>
            <p>{customer?.firstName}</p>
            <p>{customer?.lastName}</p>
            <p>{customer?.dateOfBirth}</p>
          </div>
        </div>
        <h2>Shipping address</h2>

        <div className={s.dataWrapper}>
          <div className={s.dataKey}>
            <p>Country</p>
            <p>City</p>
            <p>Street</p>
          </div>
          <div className={s.dataValuey}>
            <p>{customer?.addresses[0].country}</p>
            <p>{customer?.addresses[0].city}</p>
            <p>{customer?.addresses[0].streetName}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;

/* eslint-disable max-lines-per-function */
import { Component } from '@shared/lib';
import { element } from 'tsx-vanilla';
import * as s from './addressCard.module.scss';
import { IAddressProps } from './addressCard.interface';
import { AddressCardText, countryCode } from './config';

class AddressCard extends Component<IAddressProps> {
  render(): JSX.Element {
    const {
      country,
      city,
      streetName,
      postalCode,
      phone,
      id,
      billingAddress,
      shippingAddress,
      defaultBillingAddress,
      defaultShippingAddress,
    } = this.props;

    return (
      <div className={s.assressCard} id={id}>
        <div className={s.infoWrapper}>
          {' '}
          <p>
            <b>{AddressCardText.Country}</b>
            {`${countryCode[country]}`}
          </p>
          <p>
            <b>{AddressCardText.City}</b>
            {`${city || ''}`}
          </p>
          <p>
            <b>{AddressCardText.Street}</b>
            {`${streetName || ''}`}
          </p>
          <p>
            <b>{AddressCardText.PostalCode}</b>
            {`${postalCode || ''}`}
          </p>
          <p>
            <b>{AddressCardText.Phone}</b>
            {`${phone || ''}`}
          </p>
          {billingAddress && <span>{AddressCardText.BillingAddress.toUpperCase()}</span>}
          {shippingAddress && <span>{AddressCardText.ShippingAddress.toUpperCase()}</span>}
          {defaultBillingAddress && <span>{AddressCardText.DefaultBillingAddress.toUpperCase()}</span>}
          {defaultShippingAddress && <span>{AddressCardText.DefaultShippingAddress.toUpperCase()}</span>}
        </div>

        <div className={s.btnWrapper}>
          <button className={s.editBtn}>{AddressCardText.BtnEdit}</button>
          <button className={s.deleteBtn}>{AddressCardText.BtnDelete}</button>
        </div>
      </div>
    );
  }
}

export default AddressCard;

import { Component } from '@shared/lib';
import { element } from 'tsx-vanilla';
import * as s from './addressCard.module.scss';
import { IAddressProps } from './addressCard.interface';
import { countryCode } from './config';

class AddressCard extends Component<IAddressProps> {
  render(): JSX.Element {
    const { country, city, streetName, postalCode, phone } = this.props;

    return (
      <div className={s.assressCard}>
        <p>
          <b>Country: </b>
          {`${countryCode[country]}`}
        </p>
        <p>
          <b>City: </b>
          {`${city || ''}`}
        </p>
        <p>
          <b>Street: </b>
          {`${streetName || ''}`}
        </p>
        <p>
          <b>Postal code: </b>
          {`${postalCode || ''}`}
        </p>
        <p>
          <b>Phone: </b>
          {`${phone || ''}`}
        </p>
      </div>
    );
  }
}

export default AddressCard;

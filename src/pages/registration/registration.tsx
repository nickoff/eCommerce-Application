import { element } from 'tsx-vanilla';
import Component from '@shared/component';
import './registration.scss';

import { RegPageText, InputItems, InputShippingAddressItems, InputBillingAddressItems } from './config';

class PageReg extends Component {
  render(): JSX.Element {
    return (
      <form className="form-reg sign-wrapper hidden">
        <h2 className="page-title">{RegPageText.Title}</h2>
        {InputItems.map((item) => item.render())}
        <div className="address address-shiping">
          <h3>{RegPageText.TitleShipingAddress}</h3>
          {InputShippingAddressItems.map((item) => item.render())}
        </div>
        <div className="address address-billing">
          <div className="billing-title">
            <h3>{RegPageText.TitleBillingAddress}</h3>
            <p className="billing-label">{RegPageText.LableForCheckBox}</p>
            <input type="checkbox" className="billing-checkbox" />
          </div>
          <div className="billing-wrapper">{InputBillingAddressItems.map((item) => item.render())}</div>
        </div>
        <span className="sign-text sign-text__up">
          {RegPageText.Span}
          <a className="sign-link sign-link__up" href="#">
            {RegPageText.Link}
          </a>
        </span>
        <button className="sign-btn sign-btn__up" type="submit">
          {RegPageText.Button}
        </button>
      </form>
    );
  }
}

export default PageReg;

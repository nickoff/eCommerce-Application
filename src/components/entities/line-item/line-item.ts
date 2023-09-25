import { LineItem } from '@commercetools/platform-sdk';
import { LANG_CODE } from '@shared/constants/misc';
import { ILineItem } from '@shared/interfaces/lineItem.interface';

export default class CartLineItem implements ILineItem {
  readonly id: string;

  readonly name: string;

  readonly productId: string;

  readonly quantity: number;

  readonly price: number;

  readonly discountedPrice?: number;

  readonly totalPrice: number;

  readonly image?: string;

  constructor(cartLineItem: LineItem) {
    this.id = cartLineItem.id;
    this.name = cartLineItem.name[LANG_CODE];
    this.productId = cartLineItem.productId;
    this.quantity = cartLineItem.quantity;
    this.price = cartLineItem.price.value.centAmount;
    this.discountedPrice = cartLineItem.price.discounted?.value.centAmount;
    this.totalPrice = cartLineItem.totalPrice.centAmount;
    this.image = cartLineItem.variant.images && cartLineItem.variant.images[0]?.url;
  }
}

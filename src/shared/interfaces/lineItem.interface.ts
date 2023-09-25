export interface ILineItem {
  readonly id: string;
  readonly name: string;
  readonly productId: string;
  readonly quantity: number;
  readonly price: number;
  readonly discountedPrice?: number;
  readonly totalPrice: number;
  readonly image?: string;
}

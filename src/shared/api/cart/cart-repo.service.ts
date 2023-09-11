import { ApiRoot } from '@shared/types';
import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import { Cart, CartDraft, CartPagedQueryResponse } from '@commercetools/platform-sdk';
import extractHttpError from '../extract-http-error.decorator';

class CartRepoService {
  @extractHttpError
  static async createMeCart(apiRoot: ApiRoot, cartDraft: CartDraft): Promise<Cart | HttpErrorType> {
    return apiRoot
      .me()
      .carts()
      .post({
        body: cartDraft,
      })
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getCartById(apiRoot: ApiRoot, ID: string): Promise<Cart | HttpErrorType> {
    return apiRoot
      .carts()
      .withId({ ID })
      .get()
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getCartByCustomerId(apiRoot: ApiRoot, customerId: string): Promise<Cart | HttpErrorType> {
    return apiRoot
      .carts()
      .withCustomerId({ customerId })
      .get()
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getMeActiveCart(apiRoot: ApiRoot): Promise<Cart | HttpErrorType | CartPagedQueryResponse> {
    return apiRoot
      .me()
      .carts()
      .get()
      .execute()
      .then(({ body }) => body);
  }
}

export default CartRepoService;
